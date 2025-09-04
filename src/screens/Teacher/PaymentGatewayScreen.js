import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, KeyboardAvoidingView, Platform, Animated, Dimensions } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/GradientBackground';
import AppCard from '../../components/AppCard';
import BackButton from '../../components/BackButton';
import AppButton from '../../components/AppButton';
import { useStore } from '../../store/store';
import { spacing, colors, typography, radii, elevation } from '../../theme/theme';
import WebCompatibleLinearGradient from '../../components/WebCompatibleLinearGradient';

const { width } = Dimensions.get('window');

export default function PaymentGatewayScreen({ navigation, route }) {
  const { state, actions } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const commissionAmount = 25; // $25 USD
  const processingFee = 1.50; // $1.50 USD por procesamiento
  const totalAmount = commissionAmount + processingFee;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Tarjeta',
      icon: 'card',
      description: 'Visa, Mastercard, Amex',
      color: colors.primary,
      brands: ['visa', 'mastercard', 'amex'],
    },
    {
      id: 'pse',
      name: 'PSE',
      icon: 'business',
      description: 'Transferencia inmediata',
      color: colors.secondary,
      brands: ['pse'],
    },
    {
      id: 'nequi',
      name: 'Nequi',
      icon: 'phone-portrait',
      description: 'Billetera digital',
      color: colors.accent,
      brands: ['nequi'],
    },
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setPaymentMethod(methodId);
  };

  const handleCardInputChange = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/);
    if (match) {
      const parts = [match[1], match[2], match[3], match[4]].filter(Boolean);
      return parts.join(' ');
    }
    return text;
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateCardData = () => {
    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 16) {
      Alert.alert('Error', 'Número de tarjeta inválido');
      return false;
    }
    if (!cardData.holder || cardData.holder.length < 3) {
      Alert.alert('Error', 'Nombre del titular es requerido');
      return false;
    }
    if (!cardData.expiry || cardData.expiry.length < 5) {
      Alert.alert('Error', 'Fecha de expiración inválida');
      return false;
    }
    if (!cardData.cvv || cardData.cvv.length < 3) {
      Alert.alert('Error', 'CVV inválido');
      return false;
    }
    return true;
  };

  const processPayment = async () => {
    if (paymentMethod === 'card' && !validateCardData()) {
      return;
    }

    setIsProcessing(true);
    
    // Simular procesamiento de pago
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Actualizar estado del docente como pagado
      if (state.currentTeacher?.id) {
        actions.updateTeacherPaymentStatus(state.currentTeacher.id, true);
      }
      
      // Redirigir a la página de inicio del docente después del pago exitoso
      setTimeout(() => {
        // Navegar a TeacherTabs (página de inicio del docente)
        navigation.reset({
          index: 0,
          routes: [{ name: 'TeacherTabs' }],
        });
      }, 3000);
    }, 3000);
  };

  const handleAutoComplete = () => {
    setCardData({
      number: '4532 1234 5678 9012',
      holder: 'JUAN PEREZ GARCIA',
      expiry: '12/25',
      cvv: '123',
    });
  };

  const renderStepIndicator = () => (
    <Animated.View style={[styles.stepIndicator, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.stepIndicatorContainer}>
        <View style={[styles.step, currentStep >= 1 && styles.stepActive]}>
          <WebCompatibleLinearGradient
            colors={currentStep >= 1 ? [colors.primary, colors.primaryDark] : [colors.neutral100, colors.neutral100]}
            style={styles.stepCircle}
          >
            {currentStep > 1 ? (
              <Ionicons name="checkmark" size={20} color="white" />
            ) : (
              <Text style={[styles.stepNumber, currentStep >= 1 && styles.stepNumberActive]}>1</Text>
            )}
          </WebCompatibleLinearGradient>
          <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>Método</Text>
        </View>
        
        <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />
        
        <View style={[styles.step, currentStep >= 2 && styles.stepActive]}>
          <WebCompatibleLinearGradient
            colors={currentStep >= 2 ? [colors.primary, colors.primaryDark] : [colors.neutral100, colors.neutral100]}
            style={styles.stepCircle}
          >
            {currentStep > 2 ? (
              <Ionicons name="checkmark" size={20} color="white" />
            ) : (
              <Text style={[styles.stepNumber, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
            )}
          </WebCompatibleLinearGradient>
          <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>Datos</Text>
        </View>
        
        <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />
        
        <View style={[styles.step, currentStep >= 3 && styles.stepActive]}>
          <WebCompatibleLinearGradient
            colors={currentStep >= 3 ? [colors.primary, colors.primaryDark] : [colors.neutral100, colors.neutral100]}
            style={styles.stepCircle}
          >
            <Text style={[styles.stepNumber, currentStep >= 3 && styles.stepNumberActive]}>3</Text>
          </WebCompatibleLinearGradient>
          <Text style={[styles.stepLabel, currentStep >= 3 && styles.stepLabelActive]}>Pagar</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderPaymentMethods = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.sectionTitle}>Selecciona tu método de pago</Text>
      <Text style={styles.sectionSubtitle}>Pago seguro y rápido</Text>
      <View style={styles.paymentMethodsContainer}>
        {paymentMethods.map((method) => {
          const isActive = paymentMethod === method.id;
          const isRecommended = method.id === 'card';
          return (
            <TouchableOpacity
              key={method.id}
              onPress={() => handlePaymentMethodSelect(method.id)}
              activeOpacity={0.9}
              style={styles.paymentMethodTouchable}
            >
              <WebCompatibleLinearGradient
                colors={isActive ? [method.color, colors.primaryDark] : ['rgba(0,0,0,0)', 'rgba(0,0,0,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.paymentMethodWrapper, isActive && styles.paymentMethodWrapperActive]}
              >
                <View style={[
                  styles.paymentMethodCard,
                  isActive && styles.paymentMethodCardActive
                ]}>
                  <View style={[styles.paymentMethodIcon, { backgroundColor: (isActive ? method.color + '20' : colors.neutral100) }]}>
                    <Ionicons name={method.icon} size={24} color={method.color} />
                  </View>
                  <View style={styles.paymentMethodInfo}>
                    <View style={styles.paymentMethodHeaderRow}>
                      <Text style={styles.paymentMethodName}>{method.name}</Text>
                      {isRecommended && (
                        <View style={styles.badgeRecommended}>
                          <Text style={styles.badgeRecommendedText}>Recomendado</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.paymentMethodDescription}>{method.description}</Text>
                    <View style={styles.brandChipsRow}>
                      {method.brands?.map((brand) => (
                        <View key={brand} style={[styles.brandChip, isActive && styles.brandChipActive]}>
                          {brand === 'visa' && (
                            <FontAwesome5 name="cc-visa" size={14} color={isActive ? colors.primary : colors.neutral600} />
                          )}
                          {brand === 'mastercard' && (
                            <FontAwesome5 name="cc-mastercard" size={14} color={isActive ? colors.primary : colors.neutral600} />
                          )}
                          {brand === 'amex' && (
                            <FontAwesome5 name="cc-amex" size={14} color={isActive ? colors.primary : colors.neutral600} />
                          )}
                          {brand === 'pse' && (
                            <MaterialCommunityIcons name="bank" size={16} color={isActive ? colors.primary : colors.neutral600} />
                          )}
                          {brand === 'nequi' && (
                            <MaterialCommunityIcons name="cellphone" size={16} color={isActive ? colors.primary : colors.neutral600} />
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={[styles.paymentMethodRadio, isActive && styles.paymentMethodRadioActive]}>
                    {isActive && <Ionicons name="checkmark" size={14} color={'white'} />}
                  </View>
                </View>
              </WebCompatibleLinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );

  const renderCardForm = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.sectionTitle}>Datos de tarjeta</Text>
      <View style={styles.cardForm}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Número de tarjeta</Text>
          <TextInput
            style={styles.cardInput}
            value={cardData.number}
            onChangeText={(text) => handleCardInputChange('number', formatCardNumber(text))}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={19}
          />
          <Ionicons name="card" size={20} color={colors.neutral500} style={styles.inputIcon} />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Titular</Text>
            <TextInput
              style={styles.cardInput}
              value={cardData.holder}
              onChangeText={(text) => handleCardInputChange('holder', text.toUpperCase())}
              placeholder="NOMBRE APELLIDO"
              autoCapitalize="characters"
            />
          </View>
          
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Vencimiento</Text>
            <TextInput
              style={styles.cardInput}
              value={cardData.expiry}
              onChangeText={(text) => handleCardInputChange('expiry', formatExpiry(text))}
              placeholder="MM/AA"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.cardInput}
              value={cardData.cvv}
              onChangeText={(text) => handleCardInputChange('cvv', text)}
              placeholder="123"
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderPSEForm = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.sectionTitle}>Datos PSE</Text>
      <View style={styles.cardForm}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Banco</Text>
          <TextInput
            style={styles.cardInput}
            placeholder="Selecciona tu banco"
            value="Banco Pichincha"
            editable={false}
          />
          <Ionicons name="business" size={20} color={colors.neutral500} style={styles.inputIcon} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Tipo de cuenta</Text>
          <TextInput
            style={styles.cardInput}
            placeholder="Cuenta de ahorros"
            value="Cuenta de ahorros"
            editable={false}
          />
          <Ionicons name="wallet" size={20} color={colors.neutral500} style={styles.inputIcon} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Número de cuenta</Text>
          <TextInput
            style={styles.cardInput}
            placeholder="****1234"
            value="****1234"
            editable={false}
          />
          <Ionicons name="shield-checkmark" size={20} color={colors.neutral500} style={styles.inputIcon} />
        </View>
      </View>
    </Animated.View>
  );

  const renderNequiForm = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.sectionTitle}>Datos Nequi</Text>
      <View style={styles.cardForm}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Número de celular</Text>
          <TextInput
            style={styles.cardInput}
            placeholder="300 123 4567"
            value="300 123 4567"
            editable={false}
          />
          <Ionicons name="phone-portrait" size={20} color={colors.neutral500} style={styles.inputIcon} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PIN de Nequi</Text>
          <TextInput
            style={styles.cardInput}
            placeholder="••••"
            value="••••"
            secureTextEntry
            editable={false}
          />
          <Ionicons name="lock-closed" size={20} color={colors.neutral500} style={styles.inputIcon} />
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Serás redirigido a la aplicación de Nequi para completar el pago de forma segura.
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderPaymentSummary = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.sectionTitle}>Resumen</Text>
      <View style={styles.paymentSummary}>
        <View style={styles.summaryHeader}>
          <Ionicons name="receipt" size={24} color={colors.primary} />
          <Text style={styles.summaryHeaderText}>Detalle</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryRowLeft}>
            <Ionicons name="school" size={20} color={colors.neutral600} />
            <Text style={styles.summaryLabel}>Comisión</Text>
          </View>
          <Text style={styles.summaryValue}>${commissionAmount.toLocaleString()}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryRowLeft}>
            <Ionicons name="card" size={20} color={colors.neutral600} />
            <Text style={styles.summaryLabel}>Procesamiento</Text>
          </View>
          <Text style={styles.summaryValue}>${processingFee.toLocaleString()}</Text>
        </View>
        
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <View style={styles.summaryRowLeft}>
            <Ionicons name="calculator" size={20} color={colors.primary} />
            <Text style={styles.summaryTotalLabel}>Total</Text>
          </View>
          <Text style={styles.summaryTotalValue}>${totalAmount.toLocaleString()}</Text>
        </View>
        
        <View style={styles.paymentMethodInfo}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.paymentMethodInfoText}>Método: {paymentMethods.find(m => m.id === paymentMethod)?.name}</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      {currentStep < 3 ? (
        <AppButton
          title="Continuar"
          onPress={() => setCurrentStep(currentStep + 1)}
          variant="primary"
          size="lg"
          leftIcon="arrow-forward"
        />
      ) : (
        <AppButton
          title={isProcessing ? 'Procesando...' : `Pagar $${totalAmount.toLocaleString()}`}
          onPress={processPayment}
          variant="success"
          size="lg"
          disabled={isProcessing}
        />
      )}

      {currentStep > 1 && (
        <AppButton
          title="Atrás"
          onPress={() => setCurrentStep(currentStep - 1)}
          variant="outline"
          size="md"
          leftIcon="arrow-back"
        />
      )}
    </View>
  );

  if (isSuccess) {
    return (
      <GradientBackground variant="white" theme="teacherSetup">
        <View style={styles.successContainer}>
          <Animated.View style={[styles.successCard, { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }]}>
            <WebCompatibleLinearGradient
              colors={[colors.success, colors.successDark]}
              style={styles.successIconContainer}
            >
              <Ionicons name="checkmark-circle" size={80} color="white" />
            </WebCompatibleLinearGradient>
            
            <Text style={styles.successTitle}>Pago exitoso</Text>
            <Text style={styles.successMessage}>
              Tu comisión se procesó correctamente. Bienvenido a la plataforma de docentes.
            </Text>
            
            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Ionicons name="card" size={20} color={colors.neutral600} />
                <Text style={styles.successDetail}>Monto: ${totalAmount.toLocaleString()}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Ionicons name="receipt" size={20} color={colors.neutral600} />
                <Text style={styles.successDetail}>Ref: #PAY-{Date.now().toString().slice(-8)}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Ionicons name="time" size={20} color={colors.neutral600} />
                <Text style={styles.successDetail}>Fecha: {new Date().toLocaleDateString()}</Text>
              </View>
            </View>
            
            <View style={styles.successFooter}>
              <Text style={styles.successFooterText}>Redirigiendo a tu panel de docente...</Text>
              <View style={styles.loadingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
          </Animated.View>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground variant="white" theme="teacherSetup">
      <BackButton navigation={navigation} />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButtonHeader}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.neutral700} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Pasarela de Pagos</Text>
              <Text style={styles.headerSubtitle}>Comisión de registro docente</Text>
            </View>
          </View>

          {/* Indicador de pasos */}
          {renderStepIndicator()}

          {/* Contenido según el paso */}
          {currentStep === 1 && renderPaymentMethods()}
          {currentStep === 2 && (
            <>
              {paymentMethod === 'card' && renderCardForm()}
              {paymentMethod === 'pse' && renderPSEForm()}
              {paymentMethod === 'nequi' && renderNequiForm()}
            </>
          )}
          {currentStep === 3 && renderPaymentSummary()}

          {/* Botones de acción */}
          {renderActionButtons()}

          {/* Botón de autocompletar */}
          {currentStep === 2 && paymentMethod === 'card' && (
            <View style={styles.autoCompleteButton}>
              <AppButton
                title="Autocompletar datos de prueba"
                onPress={handleAutoComplete}
                variant="info"
                size="sm"
                leftIcon="auto-fix-high"
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  backButtonHeader: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h4,
    color: colors.neutral900,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.neutral600,
  },
  // Indicador de pasos
  stepIndicator: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  step: {
    alignItems: 'center',
    minWidth: 70,
  },
  stepActive: {
    opacity: 1,
  },
  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    ...elevation.sm,
  },
  stepNumber: {
    ...typography.body,
    color: colors.neutral600,
    fontWeight: '700',
    fontSize: 14,
  },
  stepNumberActive: {
    color: 'white',
  },
  stepLabel: {
    ...typography.caption,
    color: colors.neutral500,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
  stepLabelActive: {
    color: colors.neutral700,
    fontWeight: '700',
  },
  stepLine: {
    width: 42,
    height: 3,
    backgroundColor: colors.neutral200,
    marginHorizontal: spacing.xs,
    borderRadius: 2,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  // Secciones
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.neutral900,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    color: colors.neutral600,
    marginBottom: spacing.lg,
  },
  // Métodos de pago
  paymentMethodsContainer: {
    gap: spacing.md,
  },
  paymentMethodTouchable: {
  },
  paymentMethodWrapper: {
    borderRadius: radii.xl,
    padding: 1.5,
  },
  paymentMethodWrapperActive: {
    // resaltado por gradiente
  },
  paymentMethodCard: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    ...elevation.sm,
  },
  paymentMethodCardActive: {
    borderColor: colors.primary,
    ...elevation.md,
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  badgeRecommended: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.success + '15',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.success + '40',
  },
  badgeRecommendedText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '700',
  },
  paymentMethodName: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
    fontSize: 16,
  },
  paymentMethodDescription: {
    ...typography.bodySmall,
    color: colors.neutral600,
    fontSize: 13,
  },
  brandChipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  brandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.neutral100,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  brandChipActive: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
  },
  paymentMethodRadio: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neutral300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodRadioActive: {
    backgroundColor: colors.primary,
  },
  // Formulario de tarjeta
  cardForm: {
    gap: spacing.lg,
  },
  inputGroup: {
    position: 'relative',
  },
  inputLabel: {
    ...typography.caption,
    color: colors.neutral700,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  cardInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.neutral900,
  },
  inputIcon: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    marginTop: -10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  // Resumen de pago
  paymentSummary: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.xl,
    ...elevation.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
    gap: spacing.sm,
  },
  summaryHeaderText: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  summaryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.neutral700,
    fontWeight: '500',
  },
  summaryValue: {
    ...typography.body,
    color: colors.neutral900,
    fontWeight: '700',
  },
  summaryTotal: {
    borderTopWidth: 2,
    borderTopColor: colors.neutral200,
    marginTop: spacing.md,
    paddingTop: spacing.lg,
  },
  summaryTotalLabel: {
    ...typography.subtitle,
    color: colors.neutral900,
    fontWeight: '700',
  },
  summaryTotalValue: {
    ...typography.title,
    color: colors.primary,
    fontWeight: '800',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.info + '10',
    padding: spacing.md,
    borderRadius: radii.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  paymentMethodInfoText: {
    ...typography.bodySmall,
    color: colors.info,
    fontWeight: '500',
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.info + '10',
    padding: spacing.md,
    borderRadius: radii.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.info,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },

  // Botones de acción
  actionButtons: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  nextButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radii.lg,
    ...elevation.md,
  },
  nextButtonText: {
    ...typography.body,
    color: 'white',
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  payButton: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radii.lg,
    ...elevation.md,
  },
  payButtonDisabled: {
    backgroundColor: colors.neutral400,
  },
  payButtonText: {
    ...typography.body,
    color: 'white',
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
  },
  backButtonText: {
    ...typography.body,
    color: colors.neutral600,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },

  // Botón de autocompletar
  autoCompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  autoCompleteText: {
    ...typography.caption,
    color: colors.info,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },

  // Pantalla de éxito
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  successCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    ...elevation.xl,
    maxWidth: 400,
    width: '100%',
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...elevation.lg,
  },
  successTitle: {
    ...typography.title,
    color: colors.neutral900,
    fontWeight: '800',
    marginBottom: spacing.lg,
    textAlign: 'center',
    fontSize: 28,
  },
  successMessage: {
    ...typography.body,
    color: colors.neutral600,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 26,
    fontSize: 16,
  },
  successDetails: {
    backgroundColor: colors.neutral50,
    borderRadius: radii.lg,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.xl,
  },
  successDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  successDetail: {
    ...typography.bodySmall,
    color: colors.neutral700,
    fontWeight: '500',
    flex: 1,
  },
  successFooter: {
    alignItems: 'center',
    gap: spacing.md,
  },
  successFooterText: {
    ...typography.bodySmall,
    color: colors.neutral500,
    textAlign: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
});
