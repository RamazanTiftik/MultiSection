import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


const TargetPlanListRow = ({ item, onPress, theme }) => {

  //plan type
  const planTypeName = (key) => {
    switch (key) {
      case 'fixed': return 'Sabit Aylık Ödeme';
      case 'increasing': return 'Artan Ödeme';
      case 'downpayment': return 'Peşinat + Taksit';
      case 'dateBased': return 'Tarihe Göre Plan';
      default: return 'Bilinmeyen';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} key={item.id}>
      <View style={styles.topRow}>
        <Text style={styles.goalName}>{item.goalName}</Text>
        <Text style={[styles.amount, { color: theme.text || "#007AFF" }]}>{parseFloat(item.goalAmount).toFixed(2)} ₺</Text>
      </View>

      <Text style={styles.planType}>📌 {planTypeName(item.selectedPlan)}</Text>
      <Text style={styles.date}>📅 {new Date(item.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );
};

export default TargetPlanListRow;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  planType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#999',
  },
});
