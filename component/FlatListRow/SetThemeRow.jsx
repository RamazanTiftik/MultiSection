import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { themes } from '../../theme/Themes';
import { useDispatch, useSelector } from 'react-redux';


const SetThemeRow = ({ id, name, colors, isSelected, onPress }) => {

    //theme
    const card = themes.card.cardView;
    const secondaryColor = themes.colorTheme.secondary.color;

    //redux
    const dispatch = useDispatch()
    const selectedThemeId = useSelector(state => state.theme.selectedThemeId);
    const theme = useSelector(state => state.theme.themes[selectedThemeId]);

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.card,
                card,
                isSelected && styles.activeCard
            ]}
        >
            {/* Radio Button */}
            <View style={styles.rowTop}>
                <View style={styles.radioOuter}>
                    {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.cardTitle, isSelected && styles.activeTitle]}>
                    {name}
                </Text>
            </View>

            {/* Color Preview Row */}
            <View style={styles.colorRow}>
                {colors.map((color, index) => (
                    <View
                        key={index}
                        style={[styles.colorBox, { backgroundColor: color }]}
                    />
                ))}
            </View>
        </TouchableOpacity>
    );
};

export default SetThemeRow;

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginVertical: 10,
        borderRadius: 12,
        backgroundColor: '#f4f4f4',
    },
    activeCard: {
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        color: '#333',
    },
    activeTitle: {
        color: '#007AFF',
    },
    colorRow: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 12,
    },
    colorBox: {
        width: 30,
        height: 30,
        borderRadius: 6,
    },
    rowTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007AFF',
    },
});
