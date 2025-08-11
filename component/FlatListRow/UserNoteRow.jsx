import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { themes } from '../../theme/Themes'

const UserNoteRow = ({ content, onPress }) => {

    //theme
    const textColor = themes.textTheme.text.color;

    return (
        <TouchableOpacity onPress={onPress} style={styles.noteCard}>
            <Text numberOfLines={3} style={[styles.noteText, { color: textColor }]}>
                {content}
            </Text>
        </TouchableOpacity>
    )
}

export default UserNoteRow

const styles = StyleSheet.create({
    noteCard: {
        backgroundColor: '#f0f0f0',
        width: '48%',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        minHeight: 130,
    },
})
