import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
    Dimensions,
} from 'react-native';

const CustomFlatList = ({
    data,
    selectedValue,
    onValueChange,
    placeholder,
    onDropdownOpen,
    onDropdownClose,
    width
}) => {
    const [visible, setVisible] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const inputRef = useRef(null);

    const formatItem = (item) => ({
        value: item.name || item.value || "",
        id: String(item.id || item.key),
    });

    const formattedData = data.map(formatItem);

    const selectedLabel = selectedValue?.value
        ? formattedData.find(d => d.value === selectedValue.value)?.value
        : placeholder;

    const handleSelect = (item) => {
        onValueChange(item);
        setVisible(false);
        onDropdownClose?.();
    };

    const toggleDropdown = () => {
        Keyboard.dismiss();
        const newVisible = !visible;

        if (newVisible && inputRef.current) {
            inputRef.current.measureInWindow((x, y, width, height) => {
                setDropdownPos({ top: y + height, left: x });
                setVisible(true);
                onDropdownOpen?.();
            });
        } else {
            setVisible(false);
            onDropdownClose?.();
        }
    };

    return (
        <>
            <TouchableOpacity
                ref={inputRef}
                style={[styles.input, { width: width ? width : 150 }]}
                onPress={toggleDropdown}
                activeOpacity={0.8}
            >
                <View style={styles.row}>
                    <Text style={[styles.pickerText, { color: selectedValue ? '#000' : '#aaa' }]}>
                        {selectedLabel}
                    </Text>
                    <Text style={styles.arrow}>▼</Text>
                </View>
            </TouchableOpacity >

            {visible && (
                <Modal transparent animationType="none">
                    <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                        <View style={styles.fullScreen}>
                            <View style={[
                                styles.dropdown, { width: width ? width : 150 },
                                {
                                    position: 'absolute',
                                    top: dropdownPos.top,
                                    left: dropdownPos.left,
                                }
                            ]}>
                                <FlatList
                                    data={formattedData}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.option}
                                            onPress={() => handleSelect(item)}
                                        >
                                            <Text>{item.value}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal >
            )
            }
        </>
    );
};

const styles = StyleSheet.create({
    input: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        backgroundColor: "#dee2e6",
        height: 40,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        maxHeight: 150,
        elevation: 5,
        zIndex: 999,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pickerText: {
        fontSize: 16,
    },
    arrow: {
        fontSize: 14,
        color: '#495057',
    },
    fullScreen: {
        flex: 1,
    },
    option: {
        padding: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    gradientBtn: {
        borderRadius: 15,
        width: "100%",
        height: "100%",
    },
    touchable: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15
    }
});

export default CustomFlatList;
