"""
JEEVAN AI — Gemini Conversational Brain

Replaces the hardcoded state machine with Google Gemini.
Handles natural conversation flow, code-switching, and emergency logic.
"""

import json
import logging
from dataclasses import dataclass, field

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockerThreshold, content_types

from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY not set! Brain will not function.")


@dataclass
class BrainResponse:
    text: str
    language: str
    should_create_ticket: bool = False
    ticket_data: dict | None = None
    state: str = "LIVE"


class GeminiBrain:
    """Intelligent Conversational Brain using Google Gemini."""
    
    SYSTEM_PROMPT = """
You are a highly trained, calm, and reassuring Emergency Operations Assistant for JEEVAN AI — India's National Public Health & Emergency Intelligence Platform.
Your goal is to assist citizens and callers in distress over an emergency voice call.

# Persona Constraints
- Speak naturally, warmly, and confidently.
- Never sound robotic like a typical customer service bot.
- Never panic the caller.
- Keep responses short (under 20 seconds of speech).
- Ask ONLY ONE simple question at a time. 
- Never diagnose diseases.
- Never invent hospital availability.
- Never claim an ambulance is dispatched unless confirmed.

# Language & Code Switching
- The caller may speak Hindi, Marathi, English, or mix regional terms.
- Always reply in the language the caller predominantly used in their last turn.
- If they say "Maza baba station jawal padla aahe", reply naturally in Marathi.
- If they say "Mere pitaji bus stand ke paas gir gaye", reply naturally in Hindi.

# Location Intelligence & Zone Mapping
If the caller mentions a location, landmark, or civic sector, map it to operational zones:
- Central railway station, main bus terminus, transit hubs -> ZONE_TRANSIT
- District general hospital, trauma center, medical college -> ZONE_MEDICAL_CORE
- Main market, city square, commercial center, central chowk -> ZONE_CENTRAL
- North residential, industrial corridor, bypass ring road -> ZONE_NORTH
- South civic sector, riverside promenade, municipal grounds -> ZONE_SOUTH
- East/West urban sectors, outskirts, rural/peri-urban wards -> ZONE_REGIONAL

# Emergency Detection
Classify emergencies into: MEDICAL_EMERGENCY, HEATSTROKE, DROWNING, CROWD_CRUSH, FIRE, MISSING_PERSON, ROAD_ACCIDENT, SEVERE_WEATHER, GENERAL_HELP.

# Flow
1. Greet (e.g., "Namaskar, Welcome to JEEVAN AI Emergency Support. How can I help you?").
2. Ask for details and location if not provided.
3. Provide one step of immediate first-aid guidance.
4. Tell them help is being arranged. Keep them calm.

# OUTPUT FORMAT
You MUST output valid JSON ONLY for every turn. Do not wrap in markdown blocks like ```json. Just raw JSON.
{
  "reply": "The spoken response in Hindi/Marathi/English",
  "language": "hi or mr or en",
  "emergency_type": "detected type or null",
  "severity": "CRITICAL, HIGH, MEDIUM, LOW or null",
  "landmark": "detected landmark or null",
  "zone_id": "mapped zone id or null",
  "create_ticket": true/false (set to true once you have location and emergency type)
}
"""

    def __init__(self):
        self._sessions = {}
        # We use gemini-1.5-flash for the fastest real-time response latency
        self._model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=self.SYSTEM_PROMPT,
            generation_config=genai.GenerationConfig(
                temperature=0.3,
                response_mime_type="application/json"
            ),
            safety_settings={
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockerThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockerThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockerThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockerThreshold.BLOCK_NONE,
            }
        )

    def start_session(self, session_id: str):
        """Create a new chat session for a call."""
        chat = self._model.start_chat(history=[])
        self._sessions[session_id] = {
            "chat": chat,
            "ticket_created": False
        }
        logger.info(f"Brain session started: {session_id}")

    def get_greeting(self, session_id: str, language: str = "hi") -> BrainResponse:
        """Get the initial AI greeting."""
        if session_id not in self._sessions:
            self.start_session(session_id)
            
        greetings = {
            "hi": "नमस्कार! जीवन AI आपातकालीन सहायता में आपका स्वागत है। मैं आपकी मदद के लिए यहाँ हूँ। कृपया अपनी समस्या बताएं।",
            "mr": "नमस्कार! जीवन AI आणीबाणी सहायता मध्ये आपले स्वागत आहे. मी तुमच्या मदतीसाठी येथे आहे. कृपया तुमची समस्या सांगा.",
            "en": "Namaskar! Welcome to JEEVAN AI Emergency Helpline. I am here to help you. Please describe your emergency.",
        }
        text = greetings.get(language, greetings["hi"])
        
        # Manually prime the chat history using valid Content object
        try:
            content = content_types.to_content({
                "role": "model",
                "parts": [json.dumps({
                    "reply": text,
                    "language": language,
                    "emergency_type": None,
                    "severity": None,
                    "landmark": None,
                    "zone_id": None,
                    "create_ticket": False
                })]
            })
            self._sessions[session_id]["chat"].history.append(content)
        except Exception as e:
            logger.debug(f"History priming bypassed: {e}")
        
        return BrainResponse(text=text, language=language)

    async def process_input(self, session_id: str, caller_text: str) -> BrainResponse:
        """Send caller text to Gemini and parse the JSON response."""
        if session_id not in self._sessions:
            self.start_session(session_id)
            
        session = self._sessions[session_id]
        chat = session["chat"]
        
        try:
            logger.info(f"Gemini Input: {caller_text}")
            response = await chat.send_message_async(caller_text)
            data = json.loads(response.text)
            
            logger.info(f"Gemini Output: {data}")
            
            should_create_ticket = False
            ticket_data = None
            
            # Create ticket only once per session when data is ready
            if data.get("create_ticket") and not session["ticket_created"]:
                if data.get("emergency_type") and data.get("zone_id"):
                    should_create_ticket = True
                    session["ticket_created"] = True
                    
                    ticket_data = {
                        "title": f"[VOICE SOS] {data['emergency_type']}",
                        "description": caller_text,
                        "severity": data.get("severity", "HIGH"),
                        "emergency_type": data["emergency_type"],
                        "zone_id": data["zone_id"],
                        "landmark": data.get("landmark", ""),
                        "language": data.get("language", "hi"),
                        "caller_details": "Extracted via Gemini AI",
                    }
            
            return BrainResponse(
                text=data.get("reply", "मैं आपकी मदद कर रहा हूँ।"),
                language=data.get("language", "hi"),
                should_create_ticket=should_create_ticket,
                ticket_data=ticket_data
            )
            
        except Exception as e:
            logger.error(f"Gemini processing error: {e}")
            return BrainResponse(
                text="कृपया फिर से बोलें, नेटवर्क समस्या है।",
                language="hi"
            )

    def end_session(self, session_id: str):
        if session_id in self._sessions:
            del self._sessions[session_id]

# Global singleton
ai_brain = GeminiBrain()
