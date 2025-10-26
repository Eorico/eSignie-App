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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/authContext';
import { LogIn, Mail, Lock, AlertCircle, EyeOff, Eye } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Loginstyles } from '@/styles/loginStyle';

export default function LoginScreen() {
  // inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // loading
  const [loading, setLoading] = useState(false);
  // login routers
  const { login } = useAuth();
  const router = useRouter();
  // toggle view pass
  const [showPassword, setShowPassword] = useState(false);
  const AnimatedEye = Animated.createAnimatedComponent(Eye);
  const AnimatedEyeOff = Animated.createAnimatedComponent(EyeOff);
  //invalid inputs
  const [invalidInputs, setInvalidInputs] = useState({
    email: false,
    password: false,
  });

  // Animation refs
  const iconAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  const errorTextAnim = useRef(new Animated.Value(0)).current;
  const eyeColorAnim = useRef(new Animated.Value(0)).current;
  const eyeIconColor = eyeColorAnim.interpolate({
    inputRange: [0,1],
    outputRange: ['#666', 'red']
  });

  // Fade effect for invalid inputs
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

      if (invalidInputs.password) {
        eyeColorAnim.setValue(1);
        Animated.timing(eyeColorAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }).start();
      }
    }
  }, [invalidInputs]);

  // Fade effect for error text
  useEffect(() => {
    if (error) {
      errorTextAnim.setValue(1);
      Animated.timing(errorTextAnim, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }).start();
    }
  }, [error]);
  // process of login
  const handleLogin = async () => {
    setError('');
    const validateEmail = (email: string) => /^[^\s@]+@gmail.com$/.test(email);

    const newInvalids = {
      email: email.trim() === '',
      password: password.trim() === '',
    };
    setInvalidInputs(newInvalids);

    if (Object.values(newInvalids).includes(true)) {
      Vibration.vibrate(200);
      setTimeout(() => setError('Please fill in all fields'), 200);
      return;
    }
    
    else if (!validateEmail(email)) {
      Vibration.vibrate(200);
      setError('Please enter a valid email address');
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Vibration.vibrate(200);
      setError(result.error || 'Failed to sign in');
    } else {
      router.push('/+tabs/Agreements');
    }
  };

  // pag nagerror ung inputs lalabas ung border
  const getAnimatedBorderStyle = (field: keyof typeof invalidInputs) => {
    const borderColor = borderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', 'red'],
    });

    return [
      Loginstyles.inputContainer,
      invalidInputs[field] && {
        borderColor,
        borderWidth: 1.5,
      },
    ];
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={Loginstyles.container}
    >
      <LinearGradient colors={['#4A90E2', '#357ABD']} style={Loginstyles.gradient}>
        <ScrollView contentContainerStyle={Loginstyles.scrollContent}>
          <View style={Loginstyles.content}>
            <View style={Loginstyles.header}>
              <View style={Loginstyles.iconContainer}>
                <LogIn color="#FFFFFF" size={48} strokeWidth={2} />
              </View>
              <Text style={Loginstyles.title}>Welcome Back</Text>
              <Text style={Loginstyles.subtitle}>Sign in to continue</Text>
            </View>

            <View style={Loginstyles.form}>
              {/* Animated Error Text */}
              {error ? (
                <Animated.Text
                  style={[
                    Loginstyles.errorText,
                    { opacity: errorTextAnim, textAlign: 'center', marginTop: 5 },
                  ]}
                >
                  {error}
                </Animated.Text>
              ) : null}

              {/* EMAIL */}
              <Animated.View style={getAnimatedBorderStyle('email')}>
                <Mail color="#666" size={20} style={Loginstyles.inputIcon} />
                <TextInput
                  style={Loginstyles.input}
                  placeholder="Email"
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
                <Lock color="#666" size={20} style={Loginstyles.inputIcon} />

                <TextInput
                  style={Loginstyles.input}
                  placeholder="Password"
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
                  onPress={()=>setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{paddingHorizontal: 8}}
                >
                  {showPassword ? (
                    <AnimatedEye
                      size={20}
                      color={eyeIconColor}
                    />
                  ):(
                    <AnimatedEyeOff 
                      size={20} 
                      color={eyeIconColor}
                    />
                  )}

                </TouchableOpacity>

                {invalidInputs.password}

              </Animated.View>

              <TouchableOpacity
                style={Loginstyles.forgotPassword}
                onPress={() => router.push('/+auth/forgotPass')}
                disabled={loading}
              >
                <Text style={Loginstyles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[Loginstyles.button, loading && Loginstyles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={Loginstyles.buttonText}>
                  {loading ? 'Logging in...' : 'Log In'}
                </Text>
              </TouchableOpacity>

              <View style={Loginstyles.footer}>
                <Text style={Loginstyles.footerText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.push('/+auth/signUp')}
                  disabled={loading}
                >
                  <Text style={Loginstyles.linkText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
