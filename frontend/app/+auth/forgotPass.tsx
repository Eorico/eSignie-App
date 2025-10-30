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
import { useRouter } from 'expo-router';
import { useAuth } from './context/authContext';
import { KeyRound, Mail, ArrowLeft, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ForgotPassstyles } from '@/styles/forgotPassStyle';

// forgot pass logic function
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();

  const [invalidInputs, setInvalidInputs] = useState({
    email: false,
  });

  // Animation refs
  const iconAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  const errorTextAnim = useRef(new Animated.Value(0)).current;

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Fade animations for invalid input
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

  // Fade animation for error text
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

  const handleResetPassword = async () => {
    setError('');
    setSuccess(false);

    const newInvalids = { email: email.trim() === '' };
    setInvalidInputs(newInvalids);

    if (newInvalids.email) {
      Vibration.vibrate(200);
      setTimeout(() => setError('Please enter your email address'), 200);
      return;
    }

    else if (!validateEmail(email)) {
      Vibration.vibrate(200);
      setInvalidInputs({ email: true });
      setTimeout(() => setError('Please enter a valid email address'), 200);
      return;
    }

    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      Vibration.vibrate(200);
      setError(result.error || 'Failed to reset password');
    }
  };

  const getAnimatedBorderStyle = (field: keyof typeof invalidInputs) => {
    const borderColor = borderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', 'red'],
    });

    return [
      ForgotPassstyles.inputContainer,
      invalidInputs[field] && {
        borderColor,
        borderWidth: 1.5,
      },
    ];
  };

  // xml
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={ForgotPassstyles.container}
    >
      <LinearGradient
        colors={['#f9a459ff', '#c88f56ff']}
        style={ForgotPassstyles.gradient}
      >
        <ScrollView contentContainerStyle={ForgotPassstyles.scrollContent}>
          <View style={ForgotPassstyles.content}>
            <TouchableOpacity
              style={ForgotPassstyles.backButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <ArrowLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>

            <View style={ForgotPassstyles.header}>
              <View style={ForgotPassstyles.iconContainer}>
                <Image
                  source={require('../../assets/images/forgot.png')}
                  style={{ width: 140, height: 140 }}
                />
              </View>
              <Text style={ForgotPassstyles.title}>Forgot Password?</Text>
              <Text style={ForgotPassstyles.subtitle}>
                Enter your email to reset your password
              </Text>
            </View>

            <View style={ForgotPassstyles.form}>
              {!success ? (
                <>
                
                 {/* ERROR TEXT */}
                  {error ? (
                    <Animated.Text
                      style={[
                        ForgotPassstyles.errorText,
                        { opacity: errorTextAnim, textAlign: 'center', marginTop: 5 },
                      ]}
                    >
                      {error}
                    </Animated.Text>
                  ) : null}

                  {/* EMAIL INPUT */}
                  <Animated.View style={getAnimatedBorderStyle('email')}>
                    <Mail color="#666" size={20} style={ForgotPassstyles.inputIcon} />
                    <TextInput
                      style={ForgotPassstyles.input}
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


                  <TouchableOpacity
                    style={[
                      ForgotPassstyles.button,
                      loading && ForgotPassstyles.buttonDisabled,
                    ]}
                    onPress={handleResetPassword}
                    disabled={loading}
                  >
                    <Text style={ForgotPassstyles.buttonText}>
                      {loading ? 'Sending...' : 'Reset Password'}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={ForgotPassstyles.successContainer}>
                  <Text style={ForgotPassstyles.successTitle}>Check Your Email</Text>
                  <Text style={ForgotPassstyles.successText}>
                    Password reset instructions have been sent to your email address.
                  </Text>
                  <TouchableOpacity
                    style={ForgotPassstyles.button}
                    onPress={() => router.replace('/+auth/login')}
                  >
                    <Text style={ForgotPassstyles.buttonText}>Back to Sign In</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!success && (
                <View style={ForgotPassstyles.footer}>
                  <Text style={ForgotPassstyles.footerText}>
                    Remember your password?{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.replace('/+auth/login')}
                    disabled={loading}
                  >
                    <Text style={ForgotPassstyles.linkText}>Go back</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
