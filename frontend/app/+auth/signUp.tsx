import { Image } from 'react-native';
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
  Modal,
  ActivityIndicator
} from 'react-native';
import { AlertCircle, User, Mail, Lock, Eye, EyeOff, CheckSquare, Square } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/authContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SignUpstyles } from '@/styles/signUpStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeterms] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [invalidInputs, setInvalidInputs] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  // Animations
  const iconAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  const textErrorAnim = useRef(new Animated.Value(0)).current;
  const AnimatedEye = Animated.createAnimatedComponent(Eye);
  const AnimatedEyeOff = Animated.createAnimatedComponent(EyeOff);
  const eyeColorAnim = useRef(new Animated.Value(0)).current;
  const eyeIconColor = eyeColorAnim.interpolate({
    inputRange: [0,1],
    outputRange: ['#666', 'red']
  });

  useEffect(() => {
    const anyInvalid = Object.values(invalidInputs).includes(true);
    if (anyInvalid) {
      iconAnim.setValue(1);
      borderAnim.setValue(1);
      Animated.parallel([
        Animated.timing(iconAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [invalidInputs]);

  const triggerEye = () => {
    eyeColorAnim.setValue(1);
    Animated.timing(eyeColorAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (error) {
      textErrorAnim.setValue(1);
      Animated.timing(textErrorAnim, {
        toValue: 0,
        duration: 2000,
        delay: 2000,
        useNativeDriver: true,
      }).start(() => setError(''));
    }
  }, [error]);

  const validateEmail = (email: string) => /^[^\s@]+@gmail.com$/.test(email);

  const handleSignUp = async () => {
    setError('');
    const newInvalids = {
      name: name.trim() === '',
      email: email.trim() === '',
      password: password.trim() === '',
      confirmPassword: confirmPassword.trim() === '',
    };
    setInvalidInputs(newInvalids);

    if (Object.values(newInvalids).includes(true)) {
      Vibration.vibrate(200);
      setError(t('register.error_fill_fields'));
      triggerEye();
      return;
    } else if (!validateEmail(email)) {
      setInvalidInputs(prev => ({ ...prev, email: true }));
      Vibration.vibrate(200);
      setError(t('register.error_invalid_email'));
      return;
    } else if (password.length < 6) {
      setInvalidInputs(prev => ({ ...prev, password: true }));
      Vibration.vibrate(200);
      setError(t('register.error_password_length'));
      triggerEye();
      return;
    } else if (password !== confirmPassword) {
      setInvalidInputs(prev => ({ ...prev, confirmPassword: true }));
      Vibration.vibrate(200);
      setError(t('register.error_password_mismatch'));
      triggerEye();
      return;
    }
    if (!agreeTerms) {
      setError(t('register.error_agree_terms'));
      Vibration.vibrate(200);
      return;
    }

    setLoading(true);
    const MINLOADINGTIME = 2000;
    const start = Date.now();
    const result = signUp(email, password, name);

    const elapsed = Date.now() - start;
    if (elapsed < MINLOADINGTIME) {
      await new Promise(res => setTimeout(res, MINLOADINGTIME - elapsed))
    }

    setLoading(false);
    
    if (!result) {
      setError(result || t('register.error_failed_signup'));
    } else {
      await AsyncStorage.setItem('ACCOUNT_CREATED', 'true')
      await AsyncStorage.removeItem('CURRRENT_USER');
      router.replace('/+auth/login');
    }
  };

  const getAnimatedBorderStyle = (field: keyof typeof invalidInputs) => {
    const borderColor = borderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', 'red'],
    });
    return [
      SignUpstyles.inputContainer,
      invalidInputs[field] && {
        borderColor,
        borderWidth: 1.5,
      },
    ];
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={SignUpstyles.container}
    >
      <LinearGradient colors={['#f9a459ff', '#c88f56ff']} style={SignUpstyles.gradient}>
        <ScrollView contentContainerStyle={SignUpstyles.scrollContent}>
          <View style={SignUpstyles.content}>
            <View style={SignUpstyles.header}>
              <View style={SignUpstyles.iconContainer}>
                <Image
                  source={require('../../assets/images/add.png')}
                  style={{ width: 158, height: 158 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={SignUpstyles.title}>{t('register.title')}</Text>
              <Text style={SignUpstyles.subtitle}>{t('register.subtitle')}</Text>
            </View>

            <View style={SignUpstyles.form}>
              {error ? (
                <Animated.Text style={[SignUpstyles.errorText, { opacity: textErrorAnim }]}>
                  {error}
                </Animated.Text>
              ) : null}

              {/* NAME */}
              <Animated.View style={getAnimatedBorderStyle('name')}>
                <User color="#666" size={20} style={SignUpstyles.inputIcon} />
                <TextInput
                  style={SignUpstyles.input}
                  placeholder={t('register.name_placeholder')}
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (text.trim()) setInvalidInputs((p) => ({ ...p, name: false }));
                  }}
                  editable={!loading}
                />
                {invalidInputs.name && (
                  <Animated.View style={{ opacity: iconAnim }}>
                    <AlertCircle color="red" size={18} />
                  </Animated.View>
                )}
              </Animated.View>

              {/* EMAIL */}
              <Animated.View style={getAnimatedBorderStyle('email')}>
                <Mail color="#666" size={20} style={SignUpstyles.inputIcon} />
                <TextInput
                  style={SignUpstyles.input}
                  placeholder={t('register.email_placeholder')}
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (text.trim()) setInvalidInputs((p) => ({ ...p, email: false }));
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
                {invalidInputs.email && (
                  <Animated.View style={{ opacity: iconAnim }}>
                    <AlertCircle color="red" size={18} />
                  </Animated.View>
                )}
              </Animated.View>

              {/* PASSWORD */}
              <Animated.View style={getAnimatedBorderStyle('password')}>
                <Lock color="#666" size={20} style={SignUpstyles.inputIcon} />
                <TextInput
                  style={SignUpstyles.input}
                  placeholder={t('register.password_placeholder')}
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (text.trim()) setInvalidInputs((p) => ({ ...p, password: false }));
                  }}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{ paddingHorizontal: 8 }}
                >
                  {showPassword ? <AnimatedEyeOff size={20} color={eyeIconColor} /> : <AnimatedEye size={20} color={eyeIconColor} />}
                </TouchableOpacity>
              </Animated.View>

              {/* CONFIRM PASSWORD */}
              <Animated.View style={getAnimatedBorderStyle('confirmPassword')}>
                <Lock color="#666" size={20} style={SignUpstyles.inputIcon} />
                <TextInput
                  style={SignUpstyles.input}
                  placeholder={t('register.confirm_password_placeholder')}
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (text.trim()) setInvalidInputs((p) => ({ ...p, confirmPassword: false }));
                  }}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{ paddingHorizontal: 8 }}
                >
                  {showPassword ? <AnimatedEyeOff size={20} color={eyeIconColor} /> : <AnimatedEye size={20} color={eyeIconColor} />}
                </TouchableOpacity>
              </Animated.View>

              {/* TERMS */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <TouchableOpacity
                  onPress={() => setAgreeterms(!agreeTerms)}
                  disabled={loading}
                >
                  {agreeTerms ? (
                    <CheckSquare size={24} color="#4CAF50" />
                  ) : (
                    <Square size={24} color="#666" />
                  )}
                </TouchableOpacity>

                <Text style={{ marginLeft: 8, color: '#333', flex: 1 }}>
                  {t('register.terms_text_prefix')}{" "}
                <Text
                  style={{ color: '#1E90FF', textDecorationLine: 'underline' }}
                  onPress={() => setModalVisible(true)}
                >
                  {t('register.terms_text_link')}
                </Text>
              </Text>
              </View>

              {/* CREATE BUTTON */}
              <TouchableOpacity
                style={[SignUpstyles.button, (loading || !agreeTerms) && SignUpstyles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={loading || !agreeTerms}
              >
                {loading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ActivityIndicator size={'small'} color={'#fff'} style={{ marginRight: 10 }} />
                    <Text style={SignUpstyles.buttonText}>{t('register.creating_account')}</Text>
                  </View>
                ) : (
                  <Text style={SignUpstyles.buttonText}>{t('register.create_account')}</Text>
                )}
              </TouchableOpacity>

              {/* FOOTER */}
              <View style={SignUpstyles.footer}>
                <Text style={SignUpstyles.footerText}>{t('register.already_have_account')}</Text>
                <TouchableOpacity onPress={() => router.push('/+auth/login')} disabled={loading}>
                  <Text style={SignUpstyles.linkText}>{t('register.go_back')}</Text>
                </TouchableOpacity>
              </View>

              {/* MODAL */}
              <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
                  <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 25, width: '100%', maxWidth: 400, elevation: 5 }}>
                    <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 10, color:'#333' }}>{t('register.terms_title')}</Text>
                    <ScrollView style={{ maxHeight: 250, marginBottom: 15 }}>
                      <Text style={{ fontSize: 14, color: '#555', lineHeight: 22 }}>{t('register.terms_content')}</Text>
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <TouchableOpacity onPress={() => setModalVisible(false)} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#ccc', borderRadius: 10 }}>
                        <Text style={{ color: '#333', fontWeight: '600' }}>{t('register.cancel')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { setAgreeterms(true); setModalVisible(false); }} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#4CAF50', borderRadius: 10 }}>
                        <Text style={{ color: '#fff', fontWeight: '600' }}>{t('register.agree')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
