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

// ito ung agreement details 
export default function AgreementDetail() {
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
       title: "Agreement Details",
      headerShown: true,
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete} style={CreatedAgreementstyles.headerButton}>
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#965004ff",
      },
      headerTitleStyle: {
        color: "#EAEAEA",
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
        setError('Agreement not found');
        return;
      }

      setAgreementData(agreementData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agreement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Agreement',
      'Are you sure you want to delete this agreement? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' }, 
        {
          text: 'Delete',
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
        <Text style={CreatedAgreementstyles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error || !agreementData) {
    return (
      <View style={CreatedAgreementstyles.centerContainer}>
        <Text style={CreatedAgreementstyles.errorText}>{error || 'Agreement not found'}</Text>
        <TouchableOpacity
          style={CreatedAgreementstyles.backButton}
          onPress={() => router.back()}
        >
          <Text style={CreatedAgreementstyles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

   
  // xml
  return (
    <>
      <ScrollView style={CreatedAgreementstyles.container}>
        <View style={CreatedAgreementstyles.content}>
          <View style={CreatedAgreementstyles.header}>
            <View style={CreatedAgreementstyles.headerTop}>
              <Text style={CreatedAgreementstyles.title}>{agreementData.title}</Text>
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
                  ]}
                >
                  {agreementData.status.charAt(0).toUpperCase() +
                    agreementData.status.slice(1)}
                </Text>
              </View>
            </View>
            <Text style={CreatedAgreementstyles.date}>
              Created: {formatDate(agreementData.created_at)}
            </Text>
          </View>

          <TouchableOpacity 
            style={[CreatedAgreementstyles.exportButton, {borderRadius:25}]} 
            onPress={handleExportPDF}
            >

            <Share 
              size={16} 
              color="#ffffff" 
              />

            <Text 
              style={CreatedAgreementstyles.exportButtonText}>
                Export PDF
            </Text>
            
          </TouchableOpacity>

          <View style={CreatedAgreementstyles.section}>
            <Text style={CreatedAgreementstyles.sectionTitle}>Terms and Conditions</Text>
            <View style={CreatedAgreementstyles.termsContainer}>
              <Text style={CreatedAgreementstyles.termsText}>{agreementData.terms}</Text>
            </View>
          </View>

          <View style={CreatedAgreementstyles.section}>

            <Text style={CreatedAgreementstyles.sectionTitle}>Parties</Text>
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
                  <Text style={CreatedAgreementstyles.partyLabel}>ID Number</Text>
                  <Text style={CreatedAgreementstyles.partyValue}>{person.id_number}</Text>
                  <Text style={CreatedAgreementstyles.partyValue}>{person.address}</Text>
                  <Text style={CreatedAgreementstyles.partyValue}>{person.idType}</Text>
                </View>

                {person.id_photo_uri && (
                  <View style={{ alignItems: 'center', marginVertical: 8 }}>
                    <Text style={CreateAgreementstyles.partyLabel}>ID Photo</Text>
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
                    <Text style={CreatedAgreementstyles.partyLabel}>Signature</Text>
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
                    <Text style={CreatedAgreementstyles.signButtonText}>Add Signature</Text>
                  </TouchableOpacity>
                )}

              </View>
            ))}

          </View>

          <View style={CreatedAgreementstyles.section}>

            <Text style={CreatedAgreementstyles.sectionTitle}>Witness</Text>
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
                    <Text style={CreatedAgreementstyles.partyLabel}>ID Number</Text>
                    <Text style={CreatedAgreementstyles.partyValue}>{witness.id_number}</Text>
                    <Text style={CreatedAgreementstyles.partyValue}>{witness.address}</Text>
                    <Text style={CreatedAgreementstyles.partyValue}>{witness.idType}</Text>
                  </View>

                  {witness.id_photo_uri && (
                    <View style={{ alignItems: 'center', marginVertical: 8 }}>
                      <Text style={CreateAgreementstyles.partyLabel}>ID Photo</Text>
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
                      <Text style={CreatedAgreementstyles.partyLabel}>Signature</Text>
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
                      <Text style={CreatedAgreementstyles.signButtonText}>Add Signature</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
              ) : (
                <View>
                  <Text>
                    No witness added to this agreement
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

