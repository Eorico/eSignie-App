// import to para sa mga icon and packages need for the app
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { agreementStorage, partyStorage } from '@/lib/LocalStorage';
import { useRouter } from 'expo-router';
import { CreateAgreementstyles } from '@/styles/CreateAgreement_Design';

interface PartyInput {
  name: string;
  role: string;
  id_number: string;
}

export default function CreateAgreement() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [terms, setTerms] = useState('');
  const [parties, setParties] = useState<PartyInput[]>([
    { name: '', role: '', id_number: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addParty = () => {
    setParties([...parties, { name: '', role: '', id_number: '' }]);
  };

  const removeParty = (index: number) => {
    if (parties.length > 1) {
      setParties(parties.filter((_, i) => i !== index));
    }
  };

  const updateParty = (index: number, field: keyof PartyInput, value: string) => {
    const updated = [...parties];
    updated[index][field] = value;
    setParties(updated);
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('Please enter an agreement title');
      return false;
    }
    if (!terms.trim()) {
      setError('Please enter terms and conditions');
      return false;
    }
    for (let i = 0; i < parties.length; i++) {
      const party = parties[i];
      if (!party.name.trim() || !party.role.trim() || !party.id_number.trim()) {
        setError(`Please complete all fields for Party ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const saveAgreement = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const agreement = await agreementStorage.create({
        title: title.trim(),
        terms: terms.trim(),
        status: 'draft',
      });

      const partiesData = parties.map(party => ({
        agreement_id: agreement.id,
        name: party.name.trim(),
        role: party.role.trim(),
        id_number: party.id_number.trim(),
      }));

      await partyStorage.createMultiple(partiesData);

      setTitle('');
      setTerms('');
      setParties([{ name: '', role: '', id_number: '' }]);

      router.push('/+tabs/Agreements');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save agreement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={CreateAgreementstyles.container}>
      <View style={CreateAgreementstyles.content}>
        {error && (
          <View style={CreateAgreementstyles.errorContainer}>
            <Text style={CreateAgreementstyles.errorText}>{error}</Text>
          </View>
        )}
        <View>
          <Text style={CreateAgreementstyles.titleAndterms}>Title and Terms</Text>

          <TextInput
            style={CreateAgreementstyles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Agreement Title"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TextInput
          style={[CreateAgreementstyles.input, CreateAgreementstyles.textArea]}
          value={terms}
          onChangeText={setTerms}
          placeholder="Terms and Conditions"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <View style={CreateAgreementstyles.divider} />

        {parties.map((party, index) => (
          <View key={index} style={CreateAgreementstyles.partySection}>
            <View style={CreateAgreementstyles.partyHeader}>
              <Text style={CreateAgreementstyles.partyLabel}>Party {index + 1}</Text>
              {parties.length > 1 && (
                <TouchableOpacity onPress={() => removeParty(index)}>
                  <Trash2 size={18} color="#ca1212ff" />
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              style={CreateAgreementstyles.input}
              value={party.name}
              onChangeText={(value) => updateParty(index, 'name', value)}
              placeholder="Full Name"
              placeholderTextColor="#9ca3af"
            />

            <TextInput
              style={CreateAgreementstyles.input}
              value={party.role}
              onChangeText={(value) => updateParty(index, 'role', value)}
              placeholder="Role"
              placeholderTextColor="#9ca3af"
            />

            <TextInput
              style={CreateAgreementstyles.input}
              value={party.id_number}
              onChangeText={(value) => updateParty(index, 'id_number', value)}
              placeholder="ID Number"
              placeholderTextColor="#9ca3af"
            />
          </View>
        ))}

        <TouchableOpacity onPress={addParty} style={CreateAgreementstyles.addButton}>
          <Plus size={18} color="#6b7280" />
          <Text style={CreateAgreementstyles.addButtonText}>Add Party</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[CreateAgreementstyles.saveButton, loading && CreateAgreementstyles.saveButtonDisabled]}
          onPress={saveAgreement}
          disabled={loading}
        >
          <Text style={CreateAgreementstyles.saveButtonText}>
            {loading ? 'Saving...' : 'Create Agreement'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}