import React from 'react';
import LottieView from 'lottie-react-native';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Vibration,
  Animated,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/authContext';
import { Mail, Lock, AlertCircle, EyeOff, Eye, Square, CheckSquare } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Loginstyles } from '@/styles/loginStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import i18n from "@/lib/language";

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [languageModal, setLanguageModal] = useState(false);
  const [, forceUpdate] = React.useState(false);
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => forceUpdate(prev => !prev));
    setLanguageModal(false);
  };

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const AnimatedEye = Animated.createAnimatedComponent(Eye);
  const AnimatedEyeOff = Animated.createAnimatedComponent(EyeOff);

  const [invalidInputs, setInvalidInputs] = useState({ email: false, password: false });
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  const errorTextAnim = useRef(new Animated.Value(0)).current;
  const eyeColorAnim = useRef(new Animated.Value(0)).current;
  const eyeIconColor = eyeColorAnim.interpolate({ inputRange: [0,1], outputRange: ['#666', 'red'] });

  const [curIndex, setCurIndex] = useState(0);
  const [success, setSuccessModal] = useState(false);

  const loginGreetings = t('login.greetings', { returnObjects: true }) as string[];

  useEffect(() => {
    const checkAccountCreated = async () => {
      const accountCreated = await AsyncStorage.getItem('ACCOUNT_CREATED');
      if (accountCreated === 'true') {
        setSuccessModal(true);
        setTimeout(() => setSuccessModal(false), 3000);
        await AsyncStorage.removeItem('ACCOUNT_CREATED');
      }
    };
    checkAccountCreated();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        setCurIndex((prevIndex) => (prevIndex + 1) % loginGreetings.length);
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  useEffect(() => {
    const loadRememberMe = async () => {
      const remember = await AsyncStorage.getItem('rememberMe');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('password');
      if (remember === 'true' && storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
        setRememberMe(true);
      }
    };
    loadRememberMe();
  }, []);

  useEffect(() => {
    const anyInvalid = Object.values(invalidInputs).includes(true);
    if (anyInvalid) {
      iconAnim.setValue(1);
      borderAnim.setValue(1);
      Animated.parallel([
        Animated.timing(iconAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        Animated.timing(borderAnim, { toValue: 0, duration: 3000, useNativeDriver: false })
      ]).start();
      if (invalidInputs.password) {
        eyeColorAnim.setValue(1);
        Animated.timing(eyeColorAnim, { toValue: 0, duration: 2000, useNativeDriver: false }).start();
      }
    }
  }, [invalidInputs]);

  useEffect(() => {
    if (error) {
      errorTextAnim.setValue(1);
      Animated.timing(errorTextAnim, { toValue: 0, duration: 3000, useNativeDriver: true }).start();
    }
  }, [error]);

  const handleLogin = async () => {
    setError('');
    const validateEmail = (email: string) => /^[^\s@]+@gmail.com$/.test(email);

    const newInvalids = { email: email.trim() === '', password: password.trim() === '' };
    setInvalidInputs(newInvalids);

    if (Object.values(newInvalids).includes(true)) {
      Vibration.vibrate(200);
      setTimeout(() => setError(t('login.error_fill_fields')), 200);
      return;
    } else if (!validateEmail(email)) {
      Vibration.vibrate(200);
      setError(t('login.error_invalid_email'));
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Vibration.vibrate(200);
      setError(result.error || t('login.error_failed_signin'));
    } else {
      router.push('/+tabs/Agreements');
    }
  };

  const getAnimatedBorderStyle = (field: keyof typeof invalidInputs) => {
    const borderColor = borderAnim.interpolate({ inputRange: [0,1], outputRange: ['transparent','red'] });
    return [Loginstyles.inputContainer, invalidInputs[field] && { borderColor, borderWidth: 1.5 }];
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={Loginstyles.container}>
      <LinearGradient colors={['#f9a459ff', '#c88f56ff']} style={Loginstyles.gradient}>
        <ScrollView contentContainerStyle={Loginstyles.scrollContent}>
          <View style={Loginstyles.content}>
            <View style={Loginstyles.header}>
              <View style={Loginstyles.iconContainer}>
                <LottieView source={require('../../assets/splashAnimation/Hello.json')} autoPlay loop speed={2.5} style={{ width: 130, height: 130 }} />
              </View>
              <Animated.Text style={[Loginstyles.title, {opacity: fadeAnim}]}>{loginGreetings[curIndex]}</Animated.Text>
              <Text style={Loginstyles.subtitle}>{t('login.subtitle')}</Text>
            </View>

            <View style={Loginstyles.form}>
              {error ? <Animated.Text style={[Loginstyles.errorText, { opacity: errorTextAnim, textAlign: 'center', marginTop: 5 }]}>{error}</Animated.Text> : null}

              {/* EMAIL */}
              <Animated.View style={getAnimatedBorderStyle('email')}>
                <Mail color="#666" size={20} style={Loginstyles.inputIcon} />
                <TextInput
                  style={Loginstyles.input}
                  placeholder={t('login.email_placeholder')}
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={(text) => { setEmail(text); if (text.trim()) setInvalidInputs((p) => ({ ...p, email: false })); }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
                {invalidInputs.email && <Animated.View style={{ opacity: iconAnim }}><AlertCircle color="red" size={18} /></Animated.View>}
              </Animated.View>

              {/* PASSWORD */}
              <Animated.View style={getAnimatedBorderStyle('password')}>
                <Lock color="#666" size={20} style={Loginstyles.inputIcon} />
                <TextInput
                  style={Loginstyles.input}
                  placeholder={t('login.password_placeholder')}
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={(text) => { setPassword(text); if (text.trim()) setInvalidInputs((p) => ({ ...p, password: false })); }}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity onPress={()=>setShowPassword(!showPassword)} disabled={loading} style={{paddingHorizontal: 8}}>
                  {showPassword ? <AnimatedEye size={20} color={eyeIconColor} /> : <AnimatedEyeOff size={20} color={eyeIconColor} />}
                </TouchableOpacity>
              </Animated.View>

              <View style={Loginstyles.rememberForgotContainer}>
                <TouchableOpacity style={Loginstyles.rememberMeButton} onPress={() => setRememberMe(!rememberMe)} disabled={loading}>
                  {rememberMe ? <CheckSquare size={18} color={'#7a4a06'} /> : <Square size={18} color={'#7a4a06'} />}
                  <Text style={Loginstyles.rememberMeText}>{t('login.remember_me')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Loginstyles.forgotPasswordContainer} onPress={() => router.push('/+auth/forgotPass')} disabled={loading}>
                  <Text style={Loginstyles.forgotPasswordText}>{t('login.forgot_password')}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[Loginstyles.button, loading && Loginstyles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
                <Text style={Loginstyles.buttonText}>{loading ? t('login.login_loading') : t('login.login_button')}</Text>
              </TouchableOpacity>

              <View style={Loginstyles.footer}>
                <Text style={Loginstyles.footerText}>{t('login.no_account')} </Text>
                <TouchableOpacity onPress={() => router.push('/+auth/signUp')} disabled={loading}>
                  <Text style={Loginstyles.linkText}>{t('login.signup_here')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* LANGUAGE SWITCHER */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => changeLanguage('en')}><Text style={{ color: 'white', marginHorizontal: 6 }}>{t('login.lang_english')}</Text></TouchableOpacity>
            <Text style={{ color: 'white' }}>•</Text>
            <TouchableOpacity onPress={() => changeLanguage('fil')}><Text style={{ color: 'white', marginHorizontal: 6 }}>{t('login.lang_filipino')}</Text></TouchableOpacity>
          </View>
        </View>

        {/* SUCCESS MODAL */}
        <Modal visible={success} transparent animationType='fade'>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ width: 250, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' }}>
              <LottieView source={require('../../assets/splashAnimation/success.json')} autoPlay loop={false} style={{ width: 150, height: 150 }} />
              <Text style={{ marginTop: 10, fontSize: 15, fontWeight: '600', textAlign: 'center' }}>
                {t('login.success_created')}
              </Text>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
