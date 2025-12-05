import React from 'react';
import { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Trash2, Edit, Share } from 'lucide-react-native';
import { agreementStorage, partyStorage, witnessStorage, type AgreementWithPartiesAndWitness } from '@/lib/LocalStorage';
import SignatureModal from '@/components/ui/SignatureModal';
import { generatePDF } from '@/lib/utils/pdfGenerator';
import { CreatedAgreementstyles } from '@/styles/Created_Agreement_Design';
import { CreateAgreementstyles } from '@/styles/CreateAgreement_Design';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from "@/lib/language";
import { useTranslation } from "react-i18next";

// ito ung agreement details 
export default function AgreementDetail() {
  const { t } = useTranslation();
  const THEME_KEY = "@theme_mode";
  const [languageModal, setLanguageModal] = useState(false);
  const [isChocoMode, setIsChocoMode] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(THEME_KEY);
        setIsChocoMode(v === "choco" || v === 'true' || v === 'dark');
      } catch { /* ignore */}
      })();
    }, []);

  const backgroundColor = isChocoMode ? "#8B5E3C" : "#f9cfa3ff";
  const primaryTextColor = isChocoMode ? "#F5F5F0" : "#000000";
  const bodyTextColor = isChocoMode ? "#E0E0E0" : "#333333";
  const controlBorderColor = (invalid = false) => invalid ? 'red' : (isChocoMode ? primaryTextColor : '#632402ff');


  // Force re-render when language changes
  const [, forceUpdate] = React.useState(false);
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => forceUpdate(prev => !prev));
    setLanguageModal(false);
  };

  const { id } = useLocalSearchParams();
  // router
  const router = useRouter();

  // inherited agreement 
  const [agreementData, setAgreementData] = useState<AgreementWithPartiesAndWitness | null>(null);

  // loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // signature 
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);
  const [selectedWitnessId, setSelectedWitnessId] = useState<string | null>(null);
  const [isSignWitness, setIsSignWitness] = useState(false);

  const nav = useNavigation();

  useLayoutEffect(()=> {
    nav.setOptions({
       title: t('id.details'),
      headerShown: true,
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete} style={CreatedAgreementstyles.headerButton}>
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: isChocoMode ? "#8B5E3C" : "#965004ff",
      },
      headerTitleStyle: {
        color: isChocoMode ? primaryTextColor : "#EAEAEA",
        fontWeight: "600",
        fontSize: 20,
      },
    });
  }, [nav])

  useEffect(() => {
    fetchAgreementDetails();
  }, [id]);

  const fetchAgreementDetails = async () => {
    try {
      setError(null);

      const agreementData = await agreementStorage.getById(id as string);

      if (!agreementData) {
        setError(t('id.error'));
        return;
      }

      setAgreementData(agreementData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : t('id.failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      t('id.deleteTitle'),
      t('id.deleteSubtext'),
      [
        { text: t('id.cancel'), style: 'cancel' }, 
        {
          text: t('id.proceed'),
          style: 'destructive',
          onPress: async () => {
            try {
              await agreementStorage.delete(id as string);
              router.replace('/+tabs/Agreements');
            } catch (err) {
              console.error('Caught error:', err);
              Alert.alert(
                'Error',
                err instanceof Error ? err.message : 'Failed to delete agreement'
              );
            }
          },
        },
      ]
    );
  };

  // dito ung pag maglalagay na ng pirma
  const partySign = (partyId: string) => {
    setSelectedPartyId(partyId);
    setSelectedWitnessId(null);
    setIsSignWitness(false);
    setSignatureModalVisible(true);
  };

  const witnessSign = (witnessId: string) => {
    setSelectedWitnessId(witnessId);
    setSelectedPartyId(null);
    setIsSignWitness(true);
    setSignatureModalVisible(true);
  }

  const handleSaveSignature = async (signature: string) => {
   try {
    if (selectedPartyId && !isSignWitness) {
      await partyStorage.update(selectedPartyId, {
        signature_url: signature,
        signed_at: new Date().toISOString(),
      });
    } else if (selectedWitnessId && isSignWitness) {
      await witnessStorage.update(selectedWitnessId, {
        signature_url: signature,
        signed_at: new Date().toISOString(),
      });
    }

    if (agreementData) {
      const allPartiesSigned = agreementData.parties.every(p => p.signature_url);
      const allWitnessesSigned = agreementData.witnesses?.every(w => w.signature_url) ?? true;
      if (allPartiesSigned && allWitnessesSigned) {
        await agreementStorage.update(id as string, { status: 'completed' });
      }
    }

    fetchAgreementDetails();
   } catch (error) {
    Alert.alert(
      "Error", 
      error instanceof Error ? error.message : "Failed to save signature"
    );
   } finally {
    setSignatureModalVisible(false);
    setSelectedPartyId(null);
    setSelectedWitnessId(null);
    setIsSignWitness(false);
   }
  };

  const handleExportPDF = async () => {
    if (!agreementData) return;

    try {
      const filename = 
      await generatePDF(agreementData);
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to generate PDF'
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'signed':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <View style={CreatedAgreementstyles.centerContainer}>
        <Text style={[CreatedAgreementstyles.loadingText, { color: primaryTextColor }]}>Loading...</Text>
      </View>
    );
  }

  if (error || !agreementData) {
    return (
      <View style={CreatedAgreementstyles.centerContainer}>
        <Text style={[CreatedAgreementstyles.errorText, { color: primaryTextColor }]}>{error || 'Agreement not found'}</Text>
        <TouchableOpacity
          style={CreatedAgreementstyles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[CreatedAgreementstyles.backButtonText, { color: primaryTextColor }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

   
  // xml
  return (
    <>
      <ScrollView style={[CreatedAgreementstyles.container, { backgroundColor }]}>
        <View style={CreatedAgreementstyles.content}>
          <View style={CreatedAgreementstyles.header}>
            <View style={CreatedAgreementstyles.headerTop}>
              <Text style={[CreatedAgreementstyles.title, { color: primaryTextColor }]}>{agreementData.title}</Text>
              <View
                style={[
                  CreatedAgreementstyles.statusBadge,
                  { backgroundColor: `${getStatusColor(agreementData.status)}20` },
                ]}
              >
                <Text
                  style={[
                    CreatedAgreementstyles.statusText,
                    { color: getStatusColor(agreementData.status) },
                    { color: primaryTextColor },
                  ]}
                >
                  {agreementData.status.charAt(0).toUpperCase() +
                    agreementData.status.slice(1)}
                </Text>
              </View>
            </View>
            <Text style={[CreatedAgreementstyles.date, { color: bodyTextColor }]}>
               Created: {formatDate(agreementData.created_at)}
             </Text>
          </View>

          <TouchableOpacity 
            style={[CreatedAgreementstyles.exportButton, { borderRadius: 25, backgroundColor: isChocoMode ? '#F5F5F0' : '#965004ff' }]} 
            onPress={handleExportPDF}
            >

            <Share 
              size={16} 
              color={isChocoMode ? '#632402ff' : '#ffffff'} 
              />

            <Text 
              style={[CreatedAgreementstyles.exportButtonText, { color: isChocoMode ? '#632402ff' : '#ffffff' }]}>
               {t('id.export')}
            </Text>
            
          </TouchableOpacity>

          <View style={CreatedAgreementstyles.section}>
            <Text style={[CreatedAgreementstyles.sectionTitle, { color: primaryTextColor }]}>{t('id.TnC')}</Text>
            <View style={CreatedAgreementstyles.termsContainer}>
              <Text style={CreatedAgreementstyles.termsText}>{agreementData.terms}</Text>
            </View>
          </View>

          <View style={CreatedAgreementstyles.section}>

            <Text style={[CreatedAgreementstyles.sectionTitle, { color: primaryTextColor }]}>{t('id.parties')}</Text>
            {agreementData.parties.map((person) => (
              <View key={person.id} style={CreatedAgreementstyles.partyCard}>
                <View style={CreatedAgreementstyles.partyHeader}>
                  <Text style={CreatedAgreementstyles.partyTitle}>
                    {person.name} - {person.role}
                  </Text>
                  {person.signed_at && (
                    <Text style={CreatedAgreementstyles.signedText}>✓ Signed</Text>
                  )}
                </View>

                <View style={CreatedAgreementstyles.partyInfo}>
                  <Text style={CreatedAgreementstyles.partyLabel}>{t('id.idnum')}</Text>
                  <Text style={CreatedAgreementstyles.partyValue}>{person.id_number}</Text>
                  <Text style={CreatedAgreementstyles.partyValue}>{person.address}</Text>
                  <Text style={CreatedAgreementstyles.partyValue}>{person.idType}</Text>
                </View>

                {person.id_photo_uri && (
                  <View style={{ alignItems: 'center', marginVertical: 8 }}>
                    <Text style={CreateAgreementstyles.partyLabel}>{t('id.idphoto')}</Text>
                    <Image 
                      source={{ uri: person.id_photo_uri }}
                      style={{
                        width: 320,
                        height: 200,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#632402ff',
                        resizeMode: 'cover',
                      }}
                    />
                  </View>
                )}

                {person.signature_url ? (
                  <View style={CreatedAgreementstyles.signatureContainer}>
                    <Text style={CreatedAgreementstyles.partyLabel}>{t('id.signTitle')}</Text>
                    <Image
                      source={{ uri: person.signature_url }}
                      style={CreatedAgreementstyles.signatureImage}
                      resizeMode="contain"
                    />
                    <Text style={CreatedAgreementstyles.signedDate}>
                      Signed: {formatDate(person.signed_at!)}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={CreatedAgreementstyles.signButton}
                    onPress={() => partySign(person.id)}
                  >
                    <Edit size={16} color="#ffffff" />
                    <Text style={CreatedAgreementstyles.signButtonText}>{t('id.addSign')}</Text>
                  </TouchableOpacity>
                )}

              </View>
            ))}

          </View>

          <View style={CreatedAgreementstyles.section}>

            <Text style={[CreatedAgreementstyles.sectionTitle, { color: primaryTextColor }]}>{t('id.witness')}</Text>
            {agreementData.witnesses && agreementData.witnesses.length > 0 ? (
              agreementData.witnesses.map((witness) => (
                <View key={witness.id} style={CreatedAgreementstyles.partyCard}>
                  <View style={CreatedAgreementstyles.partyHeader}>
                    <Text style={CreatedAgreementstyles.partyTitle}>
                      {witness.name} - {witness.role}
                    </Text>
                    {witness.signed_at && (
                      <Text style={CreatedAgreementstyles.signedText}>✓ Signed</Text>
                    )}
                  </View>

                  <View style={CreatedAgreementstyles.partyInfo}>
                    <Text style={CreatedAgreementstyles.partyLabel}>{t('id.idnum')}</Text>
                    <Text style={CreatedAgreementstyles.partyValue}>{witness.id_number}</Text>
                    <Text style={CreatedAgreementstyles.partyValue}>{witness.address}</Text>
                    <Text style={CreatedAgreementstyles.partyValue}>{witness.idType}</Text>
                  </View>

                  {witness.id_photo_uri && (
                    <View style={{ alignItems: 'center', marginVertical: 8 }}>
                      <Text style={CreateAgreementstyles.partyLabel}>{t('id.idphoto')}</Text>
                      <Image 
                        source={{ uri: witness.id_photo_uri }}
                        style={{
                          width: 320,
                          height: 200,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: '#632402ff',
                          resizeMode: 'cover',
                        }}
                      />
                    </View>
                  )}

                  {witness.signature_url ? (
                    <View style={CreatedAgreementstyles.signatureContainer}>
                      <Text style={CreatedAgreementstyles.partyLabel}>{t('id.signTitle')}</Text>
                      <Image
                        source={{ uri: witness.signature_url }}
                        style={CreatedAgreementstyles.signatureImage}
                        resizeMode="contain"
                      />
                      <Text style={CreatedAgreementstyles.signedDate}>
                        Signed: {formatDate(witness.signed_at!)}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={CreatedAgreementstyles.signButton}
                      onPress={() => witnessSign(witness.id)}
                    >
                      <Edit size={16} color="#ffffff" />
                      <Text style={CreatedAgreementstyles.signButtonText}>{t('id.addSign')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
              ) : (
                <View>
                  <Text>
                    {t('id.nowitness')}
                  </Text>
                </View>
              )
            }

          </View>
        </View>
      </ScrollView>

      <SignatureModal
        visible={signatureModalVisible}
        onClose={() => {
          setSignatureModalVisible(false);
          setSelectedPartyId(null);
          setSelectedWitnessId(null);
          setIsSignWitness(false)
        }}
        onSave={handleSaveSignature}
        partyName={
          isSignWitness ? agreementData.witnesses?.find((w) => w.id === selectedWitnessId)?.name || 'Witness'
          : agreementData.parties.find((p) => p.id === selectedPartyId)?.name || 'Party'
        }
      />
    </>
  );
}

