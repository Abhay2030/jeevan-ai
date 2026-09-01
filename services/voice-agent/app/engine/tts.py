"""
JEEVAN AI — Edge TTS Text-to-Speech Engine

Uses Microsoft Edge TTS for natural, human-like voice synthesis
in Marathi, Hindi, and English with a calm, reassuring tone.
"""

import asyncio
import io
import logging
import time
from dataclasses import dataclass

from app.core.config import settings

logger = logging.getLogger(__name__)


@dataclass
class TTSResult:
    """Result from TTS synthesis."""
    audio_data: bytes  # MP3 audio bytes
    content_type: str  # MIME type
    text: str
    language: str
    voice: str
    duration_ms: float  # Approximate duration


# Language → Voice mapping with calm, warm neural voices
VOICE_MAP = {
    "mr": settings.TTS_VOICE_MARATHI,    # mr-IN-AarohiNeural
    "hi": settings.TTS_VOICE_HINDI,      # hi-IN-SwaraNeural
    "en": settings.TTS_VOICE_ENGLISH,    # en-IN-NeerjaNeural
    "mr-IN": settings.TTS_VOICE_MARATHI,
    "hi-IN": settings.TTS_VOICE_HINDI,
    "en-IN": settings.TTS_VOICE_ENGLISH,
}


class EdgeTTSEngine:
    """
    Text-to-Speech engine using Microsoft Edge TTS.

    Produces calm, warm, human-like voice output suitable for
    emergency guidance conversations.
    """

    def __init__(self):
        self._rate = settings.TTS_RATE
        self._volume = settings.TTS_VOLUME

    def _get_voice(self, language: str) -> str:
        """Resolve the voice name for a given language code."""
        voice = VOICE_MAP.get(language, settings.TTS_VOICE_HINDI)
        return voice

    async def synthesize(
        self,
        text: str,
        language: str = "hi",
    ) -> TTSResult:
        """
        Synthesize speech from text.

        Args:
            text: The text to speak
            language: Language code ('hi', 'mr', 'en')

        Returns:
            TTSResult with MP3 audio bytes
        """
        import edge_tts

        voice = self._get_voice(language)
        start_time = time.perf_counter()

        logger.info(f"TTS: Synthesizing '{text[:50]}...' with voice={voice}")

        communicate = edge_tts.Communicate(
            text=text,
            voice=voice,
            rate=self._rate,
            volume=self._volume,
        )

        # Collect all audio chunks
        audio_buffer = io.BytesIO()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_buffer.write(chunk["data"])

        audio_data = audio_buffer.getvalue()
        duration_ms = (time.perf_counter() - start_time) * 1000

        logger.info(
            f"TTS: Generated {len(audio_data)} bytes | "
            f"voice={voice} | time={duration_ms:.0f}ms"
        )

        return TTSResult(
            audio_data=audio_data,
            content_type="audio/mpeg",
            text=text,
            language=language,
            voice=voice,
            duration_ms=duration_ms
        )

    async def synthesize_greeting(self, language: str = "hi") -> TTSResult:
        """Generate the standard greeting in the specified language."""
        greetings = {
            "mr": "नमस्कार! जीवन AI मध्ये आपले स्वागत आहे. "
                  "मी तुमची मदत करण्यासाठी येथे आहे. "
                  "कृपया तुमची समस्या सांगा.",
            "hi": "नमस्कार! जीवन AI में आपका स्वागत है। "
                  "मैं आपकी मदद के लिए यहाँ हूँ। "
                  "कृपया अपनी समस्या बताएं।",
            "en": "Namaskar! Welcome to JEEVAN AI. "
                  "I am here to help you. "
                  "Please describe your emergency.",
        }
        text = greetings.get(language, greetings["hi"])
        return await self.synthesize(text, language)

    async def synthesize_consent_prompt(self, language: str = "hi") -> TTSResult:
        """Ask for recording consent."""
        prompts = {
            "mr": "ही कॉल तुमच्या सुरक्षिततेसाठी रेकॉर्ड केली जात आहे. "
                  "तुमची संमती आहे का?",
            "hi": "यह कॉल आपकी सुरक्षा के लिए रिकॉर्ड की जा रही है। "
                  "क्या आपकी सहमति है?",
            "en": "This call is being recorded for your safety. "
                  "Do you consent?",
        }
        text = prompts.get(language, prompts["hi"])
        return await self.synthesize(text, language)


# Global singleton
tts_engine = EdgeTTSEngine()
