import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  FlatList,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomIcons from '../../../../component/CustomIcons';
import { themes } from '../../../../theme/Themes';
import { fetchExpense, fetchIncome } from '../../../../redux/slices/pluginSlice/AiAnalysisSlice';
import { runAI } from '../../../../firebaseConfig/AI';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomIndicator from '../../../../component/CustomIndicator';


const AIAnalysisScreen = ({ navigation }) => {

  //ai chat loading
  const [loading, setLoading] = useState(false);

  //general loading
  const authLoading = useSelector((state) => state.auth.loading)
  const themeLoading = useSelector((state) => state.theme.loading)
  const generalLoading = authLoading || themeLoading

  //redux state
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  //theme - redux
  const selectedThemeId = useSelector(state => state.theme.selectedThemeId);
  const theme = useSelector(state => state.theme.themes[selectedThemeId]);

  //ai chat bot messages
  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: 'Merhaba! Finansal durumunuzu değerlendirmek ister misiniz?' },
  ]);
  const [inputText, setInputText] = useState('');

  const flatListRef = useRef(null); // Scroll to end için

  //theme
  const secondaryColor = themes.colorTheme.secondary.color;


  //Back Button Func
  const backAction = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }]
    });
    return true;
  };

  //back button listener
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleStyle: {
        color: theme.text || "#007AFF",
        fontSize: 18,
      },
      headerTitle: "Yapay Zekaya Danış",
      headerLeft: () => (
        <TouchableOpacity onPress={() => backAction()}>
          <CustomIcons icon={"Back"} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: secondaryColor,
      },
    });
  }, [navigation]);


  //when screen focused
  useEffect(() => {
    dispatch(fetchIncome({ userId }));
    dispatch(fetchExpense({ userId }));

    setMessages([
      { id: '1', sender: 'ai', text: 'Merhaba! Size nasıl yardımcı olabilirim?' },
    ]);
  }, [dispatch, userId]);


  // mesaj gönderme fonksiyonu
  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage = { id: Date.now().toString(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // 1. Geçmiş konuşmayı oluştur
      const historyPrompt = messages
        .map((m) => `${m.sender === 'user' ? 'Kullanıcı' : 'Yapay Zeka'}: ${m.text}`)
        .join('\n');

      // 2. Yeni mesajla birleştir
      const fullPrompt = `
Sen bir finansal asistan olarak görev yapıyorsun. Kullanıcıya sade, kısa ve açıklayıcı cevaplar ver. 
Tavsiye verirken dostane ama ciddi bir ton kullan. Gerektiğinde emoji de kullanabilirsin.

${historyPrompt}
Kullanıcı: ${inputText}
Yapay Zeka:
`;

      const aiReply = await runAI(fullPrompt);
      const aiMessage = { id: Date.now().toString() + '_ai', sender: 'ai', text: aiReply };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      setMessages(prev => [...prev, { id: 'error', sender: 'ai', text: 'Bir hata oluştu.' }]);
    } finally {
      setLoading(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };


  //VIEW
  if (generalLoading) {
    return (
      <View>
        <CustomIndicator />
      </View>
    )

  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: secondaryColor, width: '100%', height: '50%' }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>

            {/* Message List */}
            <FlatList
              ref={flatListRef}
              data={[...messages].reverse()} // veriyi ters çevir
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === 'user' ? styles.userBubble : styles.aiBubble,
                    { backgroundColor: theme.summary1 }
                  ]}
                >
                  <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>
                    {item.text}
                  </Text>
                </View>
              )}
              inverted
              contentContainerStyle={styles.messageList}
              keyboardShouldPersistTaps="handled"
            />


            {/* Loading Indicator */}
            {loading && <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 8 }} />}


            {/* Bottom Message Container */}
            <View style={styles.inputContainer}>

              {/* Text Input */}
              <TextInput
                style={styles.textInput}
                placeholder="Bir şey yazın..."
                value={inputText}
                onChangeText={setInputText}
                multiline
                returnKeyType="send"
                onSubmitEditing={handleSend}
              />

              {/* Button */}
              <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: theme.mainButton1 || "#007AFF" }]}>
                <Text style={styles.sendButtonText}>Gönder</Text>
              </TouchableOpacity>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }
};

export default AIAnalysisScreen;

const styles = StyleSheet.create({
  messageList: {
    padding: 16,
    paddingBottom: 100,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
    maxWidth: '75%',
    backgroundColor: '#b1bdc9ff',
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#9cbfddff',
    alignSelf: 'flex-start',
  },
  userText: {
    color: 'white',
    fontSize: 16,
  },
  aiText: {
    color: '#333',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    marginBottom: 100
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: 'white', // Gri yerine beyaz
  },
  sendButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
