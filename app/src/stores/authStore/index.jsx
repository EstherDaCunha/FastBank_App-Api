import { create } from "zustand";

export const useAuthStore = create((set) => ({
    accessToken: undefined,
    refreshToken: undefined,

    setAccessToken: (accessToken) => {
        set(state => ({...state, accessToken: accessToken,})
        );
    },
    setRefreshToken: (refreshToken) => 
        set(state => ({
            ...state,
            refreshToken: refreshToken,
        })),
    clearTokens: () =>
        set(state => ({
            accessToken: undefined,
            refreshToken: undefined,
        })),
    })
);