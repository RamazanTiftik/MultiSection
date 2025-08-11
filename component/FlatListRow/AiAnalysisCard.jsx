import { StyleSheet, Text, View } from 'react-native'


const AiAnalysisCard = ({ title, value, type }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            {type === 'money' ? (
                <Text style={styles.cardValue}>{`${value}₺`}</Text>
            ) : (
                <Text style={styles.cardValue}>{value}</Text>)
            }

        </View>
    )
}

export default AiAnalysisCard

const styles = StyleSheet.create({
    card: {
        width: '48%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardTitle: {
        fontSize: 14,
        color: '#6c757d',
    },
    cardValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
        marginTop: 4,
    },
})