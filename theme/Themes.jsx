const textTheme = {

    //casual
    text: {
        fontSize: 16,
        color: "#111111",
        fontWeight: "500"
    },

    //btn text
    btnText: {
        fontSize: 16,
        color: "white"
    },

    titleTxt: {
        fontSize: 18,
        fontWeight: "500",
        color: "#111111"
    }

}


const colorTheme = {
    //backgrounds
    primary: {
        color: "#D4F6FF"
    },
    secondary: {
        color: "#C6E7FF"
    },
    tertiary: {
        color: "#FBFBFB"
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
        backgroundColor: "#F7F7F7",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: "100%",
        /*   borderLeftWidth: 5,
          borderLeftColor: "#A9B5DF", */
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