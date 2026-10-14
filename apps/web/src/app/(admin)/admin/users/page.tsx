"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Shield, Users, Search, RefreshCw, CheckCircle2,
  XCircle, Filter, ChevronDown, UserCheck, AlertTriangle,
  ArrowLeft, Building2, User
} from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus
} from "../../../../lib/firebase";
import type { User as UserType, UserRole } from "@jeevan-ai/types";

export default function AdminUsersPage() {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getAllUsers()
      .then((data) => {
        if (isMounted) {
          setUsers(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setStatusMessage(`User role updated to ${newRole}`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update role:", err);
      setStatusMessage("Failed to update user role");
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserStatus(userId, !currentStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: !currentStatus } : u))
      );
      setStatusMessage(`User account status updated`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update status:", err);
      setStatusMessage("Failed to update status");
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Authorization check
  if (!authLoading && currentUser && currentUser.role !== "ADMIN") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-200">
        <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-500 mb-4 shadow-glow-alert">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-white mb-2">Access Restricted</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          The User Administration Directory is strictly reserved for JEEVAN AI Platform Administrators. Your current role is <strong className="text-cyan-400">{currentUser.role}</strong>.
        </p>
        <Link
          href="/command/dashboard"
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          Return to Command Operations
        </Link>
      </main>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 min-h-[100dvh] font-sans" data-theme="ink">

      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/command/dashboard"
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold font-display text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Platform Identity & User Management
            </h1>
            <p className="text-xs text-slate-400">
              Cloud Firestore Authentication Records • Role-Based Access Control (RBAC)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {statusMessage && (
            <div className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              {statusMessage}
            </div>
          )}
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      {/* Filters & Search Toolbar */}
      <div className="p-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or Firebase UID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["ALL", "ADMIN", "COMMAND", "RESPONDER", "PUBLIC"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                roleFilter === r
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="p-6 pt-2 flex-1 overflow-x-auto">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Firebase UID</th>
                <th className="py-3 px-4">Operational Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-cyan-400 mb-2" />
                    Loading Firestore accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No users matching criteria
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-cyan-400 font-mono">
                          {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{u.full_name || "Anonymous Member"}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {u.id.slice(0, 10)}...
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded border outline-none bg-slate-950 cursor-pointer ${
                          u.role === "ADMIN"
                            ? "border-red-500/60 text-red-400"
                            : u.role === "COMMAND"
                            ? "border-cyan-500/60 text-cyan-400"
                            : u.role === "RESPONDER"
                            ? "border-emerald-500/60 text-emerald-400"
                            : "border-slate-700 text-slate-300"
                        }`}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="COMMAND">COMMAND</option>
                        <option value="RESPONDER">RESPONDER</option>
                        <option value="PUBLIC">PUBLIC</option>
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleStatusToggle(u.id, u.is_active)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                          u.is_active
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/70"
                            : "bg-red-950/60 text-red-400 border-red-800/70"
                        }`}
                      >
                        {u.is_active ? "ACTIVE" : "INACTIVE"}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRoleChange(u.id, u.role === "ADMIN" ? "COMMAND" : "ADMIN")}
                        className="text-[11px] text-slate-400 hover:text-cyan-400 underline transition-colors"
                      >
                        {u.role === "ADMIN" ? "Demote to Command" : "Promote to Admin"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
