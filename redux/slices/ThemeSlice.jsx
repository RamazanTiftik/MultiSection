// redux/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    selectedThemeId: 'cold_forest',
    themes: {

        cold_forest: {
            text: "#1E293B",
            userIcon: "#379683",

            outcome1: "#A8E6CF",
            outcome2: "#56C596",

            income1: "#379683",
            income2: "#05386B",

            summary1: "#A8E6CF",
            summary2: "#379683",

            summer1: "#56C596",
            summer2: "#05386B",

            spring1: "#A8E6CF",
            spring2: "#56C596",

            winter1: "#379683",
            winter2: "#05386B",

            autumn1: "#A8E6CF",
            autumn2: "#56C596",

            mainButton1: "#379683",
            mainButton2: "#05386B",
        },

        purple_clouds: {
            text: "#1E293B",
            userIcon: "#6A4C93",

            outcome1: "#D0F4FF",
            outcome2: "#A6E3E9",

            income1: "#89C2D9",
            income2: "#6A4C93",

            summary1: "#A6E3E9",
            summary2: "#6A4C93",

            summer1: "#D0F4FF",
            summer2: "#89C2D9",

            spring1: "#A6E3E9",
            spring2: "#6A4C93",

            winter1: "#89C2D9",
            winter2: "#6A4C93",

            autumn1: "#D0F4FF",
            autumn2: "#6A4C93",

            mainButton1: "#A6E3E9",
            mainButton2: "#6A4C93",
        },

        mango_dreams: {
            text: "#1E293B",
            userIcon: "#FF8A65",

            outcome1: "#FFF176",
            outcome2: "#FFD54F",

            income1: "#FFB74D",
            income2: "#FF8A65",

            summary1: "#FFD54F",
            summary2: "#D84315",

            summer1: "#FFF176",
            summer2: "#FF8A65",

            spring1: "#FFD54F",
            spring2: "#FFB74D",

            winter1: "#FF8A65",
            winter2: "#D84315",

            autumn1: "#FFD54F",
            autumn2: "#D84315",

            mainButton1: "#FFB74D",
            mainButton2: "#D84315",
        },

        retro_summer: {
            text: "#1E293B",
            userIcon: "#4A148C",

            outcome1: "#FFF3E0",
            outcome2: "#FFCCBC",

            income1: "#FF8A65",
            income2: "#D32F2F",

            summary1: "#FFCCBC",
            summary2: "#4A148C",

            summer1: "#FFF3E0",
            summer2: "#FF8A65",

            spring1: "#FFCCBC",
            spring2: "#D32F2F",

            winter1: "#FF8A65",
            winter2: "#4A148C",

            autumn1: "#D32F2F",
            autumn2: "#4A148C",

            mainButton1: "#FF8A65",
            mainButton2: "#4A148C",
        },

        purple_mint: {
            text: "#1E293B",
            userIcon: "#7C4DFF",

            outcome1: "#A7FFEB",
            outcome2: "#64FFDA",

            income1: "#18FFFF",
            income2: "#7C4DFF",

            summary1: "#64FFDA",
            summary2: "#311B92",

            summer1: "#A7FFEB",
            summer2: "#7C4DFF",

            spring1: "#64FFDA",
            spring2: "#18FFFF",

            winter1: "#18FFFF",
            winter2: "#311B92",

            autumn1: "#7C4DFF",
            autumn2: "#311B92",

            mainButton1: "#64FFDA",
            mainButton2: "#7C4DFF",
        },

        modern_fresh: {
            text: "#1E293B",
            userIcon: "#6366F1",

            outcome1: "#FCA5A5", // Açık kırmızı
            outcome2: "#B91C1C", // Koyu kırmızı

            income1: "#86EFAC", // Açık yeşil
            income2: "#15803D", // Koyu yeşil

            summary1: "#93C5FD", // Açık mavi
            summary2: "#1E3A8A", // Koyu mavi

            summer1: "#FDE68A", // Açık sarı
            summer2: "#CA8A04", // Koyu turuncu

            spring1: "#BBF7D0",
            spring2: "#15803D",

            winter1: "#BAE6FD",
            winter2: "#1E3A8A",

            autumn1: "#FBBF24",
            autumn2: "#92400E",

            mainButton1: "#818CF8", // Açık mor
            mainButton2: "#4338CA", // Koyu mor
        },

        modern_dark: {
            text: "#E5E7EB",
            userIcon: "#A78BFA",

            outcome1: "#FCA5A5",
            outcome2: "#7F1D1D",

            income1: "#6EE7B7",
            income2: "#065F46",

            summary1: "#93C5FD",
            summary2: "#1E40AF",

            summer1: "#FCD34D",
            summer2: "#B45309",

            spring1: "#A7F3D0",
            spring2: "#065F46",

            winter1: "#BAE6FD",
            winter2: "#1E40AF",

            autumn1: "#FBBF24",
            autumn2: "#78350F",

            mainButton1: "#C4B5FD",
            mainButton2: "#5B21B6",
        },

        modern_pastel: {
            text: "#374151",
            userIcon: "#C084FC",

            outcome1: "#FECACA",
            outcome2: "#EF4444",

            income1: "#BBF7D0",
            income2: "#16A34A",

            summary1: "#BAE6FD",
            summary2: "#2563EB",

            summer1: "#FEF3C7",
            summer2: "#F59E0B",

            spring1: "#DCFCE7",
            spring2: "#16A34A",

            winter1: "#E0F2FE",
            winter2: "#2563EB",

            autumn1: "#FDE68A",
            autumn2: "#CA8A04",

            mainButton1: "#D8B4FE",
            mainButton2: "#7C3AED",
        },

        modern_neon: {
            text: "#F0FDF4",
            userIcon: "#22D3EE",

            outcome1: "#FB7185",
            outcome2: "#9F1239",

            income1: "#4ADE80",
            income2: "#065F46",

            summary1: "#60A5FA",
            summary2: "#1E3A8A",

            summer1: "#FACC15",
            summer2: "#854D0E",

            spring1: "#86EFAC",
            spring2: "#065F46",

            winter1: "#67E8F9",
            winter2: "#1E3A8A",

            autumn1: "#FBBF24",
            autumn2: "#92400E",

            mainButton1: "#67E8F9",
            mainButton2: "#0E7490",
        },

    },
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.selectedThemeId = action.payload;
            AsyncStorage.setItem('selectedThemeId', action.payload); // persist
        },
        loadTheme: (state, action) => {
            // App başlarken AsyncStorage'dan gelen tema
            if (state.themes[action.payload]) {
                state.selectedThemeId = action.payload;
            }
        },
    },
});

export const { setTheme, loadTheme } = themeSlice.actions;

export default themeSlice.reducer;
