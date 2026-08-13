"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FamilyProfile } from "@/types/family";
import { loadFamilyProfile, saveFamilyProfile, clearFamilyProfile } from "@/lib/storage";
import { saveFamilyProfileAction } from "@/app/actions/family-profile";

/** Anonymous visitors persist to localStorage; signed-in visitors persist to
 *  Supabase. The first time a signed-in session has an empty database profile
 *  but a non-empty local one, the local profile is migrated in once (then
 *  local storage is cleared — the account becomes the source of truth). */
export function useFamilyProfile(initialProfile: FamilyProfile | null, isAuthenticated: boolean) {
  const [profile, setProfile] = useState<FamilyProfile | null>(initialProfile);
  const [hydrated, setHydrated] = useState(isAuthenticated);
  const migratingRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      const local = loadFamilyProfile();
      const dbIsEmpty = !initialProfile || initialProfile.members.length === 0;

      if (dbIsEmpty && local && local.members.length > 0 && !migratingRef.current) {
        migratingRef.current = true;
        setProfile(local);
        void saveFamilyProfileAction(local)
          .then(() => clearFamilyProfile())
          .catch((err) => {
            console.error("[useFamilyProfile] migration failed:", err);
          });
      } else {
        setProfile(initialProfile);
      }
    } else {
      setProfile(loadFamilyProfile());
    }
    setHydrated(true);
    // Keyed on auth-state transitions, not every render: initialProfile always
    // changes in lockstep with isAuthenticated on the server render that produces
    // a new value for either, so the closure below is never stale when this fires.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const updateProfile = useCallback(
    (
      updater: FamilyProfile | ((prev: FamilyProfile | null) => FamilyProfile),
    ) => {
      setProfile((prev) => {
        const next =
          typeof updater === "function"
            ? (updater as (p: FamilyProfile | null) => FamilyProfile)(prev)
            : updater;
        if (isAuthenticated) {
          void saveFamilyProfileAction(next).catch((err) => {
            console.error("[useFamilyProfile] failed to save:", err);
          });
        } else {
          saveFamilyProfile(next);
        }
        return next;
      });
    },
    [isAuthenticated],
  );

  return { profile, hydrated, updateProfile };
}
