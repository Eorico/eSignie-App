import { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useNavigation } from 'expo-router';
import { Trash2, Edit, FileText, Share } from 'lucide-react-native';
import { agreementStorage, partyStorage, type AgreementWithParties } from '@/lib/LocalStorage';
import SignatureModal from '@/components/ui/SignatureModal';
import { generatePDF } from '@/utils/pdfGenerator';
import { CreatedAgreementstyles } from '@/styles/Created_Agreement_Design';

// ito ung agreement details 
export default function AgreementDetail() {
  const { id } = useLocalSearchParams();
  // router
  const router = useRouter();

  // inherited agreement 
  const [agreement, setAgreement] = useState<AgreementWithParties | null>(null);

  // loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // signature 
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);

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
        backgroundColor: "#B5702B",
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

      setAgreement(agreementData);
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
  const handleSign = (partyId: string) => {
    setSelectedPartyId(partyId);
    setSignatureModalVisible(true);
  };

  const handleSaveSignature = async (signature: string) => {
    if (!selectedPartyId) return;

    try {
      await partyStorage.update(selectedPartyId, {
        signature_url: signature,
        signed_at: new Date().toISOString(),
      });

      const allPartiesSigned = agreement?.parties.every(
        (p) => p.id === selectedPartyId || p.signature_url
      );

      if (allPartiesSigned) {
        await agreementStorage.update(id as string, { status: 'completed' });
      }

      fetchAgreementDetails();
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to save signature'
      );
    }
  };

  const handleExportPDF = async () => {
    if (!agreement) return;

    try {
      await generatePDF(agreement);
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

  if (error || !agreement) {
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
              <Text style={CreatedAgreementstyles.title}>{agreement.title}</Text>
              <View
                style={[
                  CreatedAgreementstyles.statusBadge,
                  { backgroundColor: `${getStatusColor(agreement.status)}20` },
                ]}
              >
                <Text
                  style={[
                    CreatedAgreementstyles.statusText,
                    { color: getStatusColor(agreement.status) },
                  ]}
                >
                  {agreement.status.charAt(0).toUpperCase() +
                    agreement.status.slice(1)}
                </Text>
              </View>
            </View>
            <Text style={CreatedAgreementstyles.date}>
              Created: {formatDate(agreement.created_at)}
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
              <Text style={CreatedAgreementstyles.termsText}>{agreement.terms}</Text>
            </View>
          </View>

          <View style={CreatedAgreementstyles.section}>
            <Text style={CreatedAgreementstyles.sectionTitle}>Parties</Text>
            {agreement.parties.map((party, index) => (
              <View key={party.id} style={CreatedAgreementstyles.partyCard}>
                <View style={CreatedAgreementstyles.partyHeader}>
                  <Text style={CreatedAgreementstyles.partyTitle}>
                    {party.name} - {party.role}
                  </Text>
                  {party.signed_at && (
                    <Text style={CreatedAgreementstyles.signedText}>✓ Signed</Text>
                  )}
                </View>

                <View style={CreatedAgreementstyles.partyInfo}>
                  <Text style={CreatedAgreementstyles.partyLabel}>ID Number</Text>
                  <Text style={CreatedAgreementstyles.partyValue}>{party.id_number}</Text>
                </View>

                {party.signature_url ? (
                  <View style={CreatedAgreementstyles.signatureContainer}>
                    <Text style={CreatedAgreementstyles.partyLabel}>Signature</Text>
                    <Image
                      source={{ uri: party.signature_url }}
                      style={CreatedAgreementstyles.signatureImage}
                      resizeMode="contain"
                    />
                    <Text style={CreatedAgreementstyles.signedDate}>
                      Signed: {formatDate(party.signed_at!)}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={CreatedAgreementstyles.signButton}
                    onPress={() => handleSign(party.id)}
                  >
                    <Edit size={16} color="#ffffff" />
                    <Text style={CreatedAgreementstyles.signButtonText}>Add Signature</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <SignatureModal
        visible={signatureModalVisible}
        onClose={() => {
          setSignatureModalVisible(false);
          setSelectedPartyId(null);
        }}
        onSave={handleSaveSignature}
        partyName={
          agreement.parties.find((p) => p.id === selectedPartyId)?.name || ''
        }
      />
    </>
  );
}

