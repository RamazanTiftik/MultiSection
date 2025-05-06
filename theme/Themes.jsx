const textTheme = {

    //casual
    text: {
        fontSize: 16
    },

    //btn text
    btnText: {
        fontSize: 16,
        color: "white"
    }

}


const colorTheme = {
    //backgrounds
    primary: {
        color: "#2D336B"
    },
    secondary: {
        color: "#7886C7"
    },
    tertiary: {
        color: "#A9B5DF"
    },
    quaternary: {
        color: "#A9B5DF"
    },

    //durations
    wait: {
        color: "#60B5FF"
    },
    inProgress: {
        color: "orange"
    },
    done: {
        color: "#5CB338"
    },
    rejected: {
        color: "#D84040"
    }
}

const staticCss = {
    container: {
        paddingHorizontal: 15
    }
}


const card = {
    cardView: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: "100%",
        borderLeftWidth: 5,
        borderLeftColor: "#A9B5DF",
    }
}


const loading = {
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
}


export const themes = {
    textTheme, colorTheme, staticCss, card, loading
};