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
} from 'react-native';
import { AlertCircle, UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/authContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SignUpstyles } from '@/styles/signUpStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen() {
  // inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // validations
  const [invalidInputs, setInvalidInputs] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // erro and loading 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // routers 
  const { signUp } = useAuth();
  const router = useRouter();

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
  // toggled view pass

  const [showPassword, setShowPassword] = useState(false);

  // Fade icon + border when invalid
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

  // Error text fade in/out
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

  // ung dapat ung dulo ng email is @gmail or may @
  const validateEmail = (email: string) => /^[^\s@]+@gmail.com$/.test(email);

  // process ng sign up
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
      setError('Please fill in all fields');
      triggerEye();
      return;
    }

    else if (!validateEmail(email)) {
      setInvalidInputs(prev => ({ ...prev, email: true }));
      Vibration.vibrate(200);
      setError('Please enter a valid email address');
      return;
    }

    else if (password.length < 6) {
      setInvalidInputs(prev => ({ ...prev, password: true }));
      Vibration.vibrate(200);
      setError('Password must be at least 6 characters');
      triggerEye();
      return;
    }

    else if (password !== confirmPassword) {
      setInvalidInputs(prev => ({ ...prev, confirmPassword: true }));
      Vibration.vibrate(200);
      setError('Passwords do not match');
      triggerEye();
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, name);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to create account');
    } else {
      await AsyncStorage.removeItem('CURRRENT_USER');
      router.replace('/+auth/login');
    }
  };

  // pag mali ung input ung border mag rered
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
      <LinearGradient colors={['#D2B48C', '#E0AD6C']} style={SignUpstyles.gradient}>
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
              <Text style={SignUpstyles.title}>Create Account</Text>
              <Text style={SignUpstyles.subtitle}>Sign up to get started</Text>
            </View>

            <View style={SignUpstyles.form}>
              {error ? (
                <Animated.Text
                  style={[
                    SignUpstyles.errorText,
                    { opacity: textErrorAnim },
                  ]}
                >
                  {error}
                </Animated.Text>
              ) : null}

              {/* NAME */}
              <Animated.View style={getAnimatedBorderStyle('name')}>
                <User color="#666" size={20} style={SignUpstyles.inputIcon} />
                <TextInput
                  style={SignUpstyles.input}
                  placeholder="Full Name"
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
                <Lock color="#666" size={20} style={SignUpstyles.inputIcon} />
                <TextInput
                  style={SignUpstyles.input}
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

              {/* CONFIRM PASSWORD */}
              <Animated.View style={getAnimatedBorderStyle('confirmPassword')}>
                <Lock color="#666" size={20} style={SignUpstyles.inputIcon} />
                <TextInput
                  style={SignUpstyles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (text.trim())
                      setInvalidInputs((p) => ({ ...p, confirmPassword: false }));
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

                {invalidInputs.confirmPassword}
              </Animated.View>

              <TouchableOpacity
                style={[SignUpstyles.button, loading && SignUpstyles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={SignUpstyles.buttonText}>
                  {loading ? 'Creating Account...' : 'Create'}
                </Text>
              </TouchableOpacity>

              <View style={SignUpstyles.footer}>
                <Text style={SignUpstyles.footerText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.push('/+auth/login')}
                  disabled={loading}
                >
                  <Text style={SignUpstyles.linkText}>Go back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
