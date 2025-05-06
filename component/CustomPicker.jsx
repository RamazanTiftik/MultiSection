import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

const CustomPicker = ({ data, selectedValue, onValueChange, placeholder, selectedItem }) => {
    const [visible, setVisible] = useState(false);
    let selectedLabel = ""


    const formatItem = (item) => ({
        label: item.name || item.label || selectedValue || "",
        value: item.name || item.value || selectedValue || "",
        id: String(item.id || item.key),
    });

    const formattedData = [
        {
            label: placeholder,
            value: null,
            key: "",
        },
        ...data.map(formatItem),
    ];

    if (selectedItem) { //if selectedItem is passed, use it directly -> it means that data is directly passed
        selectedLabel = typeof selectedItem === "string"
            ? selectedItem
            : selectedItem.label || placeholder;

    } else { //if selectedItem is not passed, use selectedValue to find the label
        selectedLabel = selectedValue?.value
            ? formattedData.find(d => d.value === selectedValue.value)?.label
            : selectedValue?.name ? formattedData.find(d => d.value === selectedValue.name)?.label
                : placeholder
    }


    const handleSelect = (item) => {
        onValueChange(item);
        setVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                style={styles.input}
                onPress={() => {
                    Keyboard.dismiss();
                    setVisible(true);
                }}
            >
                <View style={styles.row}>
                    <Text style={[styles.pickerText, { color: selectedValue || selectedItem ? '#000' : '#aaa' }]}>
                        {selectedLabel}
                    </Text>
                    <Text style={styles.arrow}>▼</Text>
                </View>
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setVisible(false); }}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1, justifyContent: 'center' }}
                >
                    <View style={styles.modal}>
                        <FlatList
                            data={formattedData}
                            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>


        </>
    );
};

const styles = StyleSheet.create({
    input: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: 280,
        backgroundColor: "#dee2e6",
        marginTop: 3,
        paddingRight: 10
    },
    modal: {
        backgroundColor: '#fff',
        marginHorizontal: 30,
        marginTop: '50%',
        borderRadius: 10,
        padding: 10,
        elevation: 10,
    },
    option: {
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
    },
    backdrop: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    pickerText: {
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    arrow: {
        fontSize: 14,
        color: '#495057',

    },
});

export default CustomPicker;
