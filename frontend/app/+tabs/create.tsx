import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Vibration,
  Animated,
} from 'react-native';
import { Plus, Trash2, AlertCircle } from 'lucide-react-native';
import { agreementStorage, partyStorage } from '@/lib/LocalStorage';
import { useRouter } from 'expo-router';
import { CreateAgreementstyles } from '@/styles/CreateAgreement_Design';
import { useAuth } from '../+auth/context/authContext';

// object inteface ng party inputs
interface PartyInput {
  name: string;
  role: string;
  id_number: number;
}

// function logic ng paggawa ng agreement
export default function CreateAgreement() {
  // routers
  const router = useRouter();
  const { user } = useAuth();

  // title inputs
  const [title, setTitle] = useState('');
  const [terms, setTerms] = useState('');
  const [parties, setParties] = useState<PartyInput[]>([
    { name: '', role: '', id_number: 0 },
  ]);

  // loading
  const [loading, setLoading] = useState(false);

  // invalid inputs
  const [invalidFields, setInvalidFields] = useState({
    title: false,
    terms: false,
    parties: [] as { name: boolean; role: boolean; id_number: boolean }[],
  });

  // Fade animation states
  const [fadeTitle] = useState(new Animated.Value(0));
  const [fadeTerms] = useState(new Animated.Value(0));
  const [fadeParties, setFadeParties] = useState(
    parties.map(() => [
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
    ])
  );

  // Fade helper: instantly appear (1), then fade out to 0
  const triggerFade = (anim: Animated.Value) => {
    anim.setValue(1);
    Animated.timing(anim, {
      toValue: 0,
      duration: 2000, // smooth fade-out duration (2s)
      useNativeDriver: false,
    }).start();
  };

  // pag mag aadd ng another party 
  const addParty = () => {
    setParties([...parties, { name: '', role: '', id_number: 0 }]);
    setInvalidFields((prev) => ({
      ...prev,
      parties: [...prev.parties, { name: false, role: false, id_number: false }],
    }));
    setFadeParties((prev) => [
      ...prev,
      [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)],
    ]);
  };

  // delete party
  const removeParty = (index: number) => {
    if (parties.length > 1) {
      setParties(parties.filter((_, i) => i !== index));
      setInvalidFields((prev) => ({
        ...prev,
        parties: prev.parties.filter((_, i) => i !== index),
      }));
      setFadeParties((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // updating ng party 
  const updateParty = (index: number, field: keyof PartyInput, value: string) => {
    const updated = [...parties];
    if (field === 'id_number') {
      const numValue = Number(value);
      updated[index][field] = isNaN(numValue) ? 0 : numValue;
    } else {
      updated[index][field] = value;
    }
    setParties(updated);
  };

  // validation ng mga inputs 
  const validateForm = () => {
    let isValid = true;
    const partyErrors = parties.map(() => ({
      name: false,
      role: false,
      id_number: false,
    }));

    // 🔹 Title check
    if (!title.trim()) {
      isValid = false;
      Vibration.vibrate(200);
      setInvalidFields((prev) => ({ ...prev, title: true }));
      triggerFade(fadeTitle);
      setTimeout(() => setInvalidFields((prev) => ({ ...prev, title: false })), 2000);
    }

    // 🔹 Terms check
    if (!terms.trim()) {
      isValid = false;
      Vibration.vibrate(200);
      setInvalidFields((prev) => ({ ...prev, terms: true }));
      triggerFade(fadeTerms);
      setTimeout(() => setInvalidFields((prev) => ({ ...prev, terms: false })), 2000);
    }

    // 🔹 Party checks
    parties.forEach((party, i) => {
      if (!party.name.trim()) partyErrors[i].name = true;
      if (!party.role.trim()) partyErrors[i].role = true;
      if (party.id_number <= 0) partyErrors[i].id_number = true;

      if (
        partyErrors[i].name ||
        partyErrors[i].role ||
        partyErrors[i].id_number
      ) {
        isValid = false;
        fadeParties[i].forEach((anim, j) => {
          if (partyErrors[i][['name', 'role', 'id_number'][j] as keyof PartyInput]) {
            triggerFade(anim);
          }
        });
      }
    });

    if (!isValid) Vibration.vibrate(300);
    setInvalidFields((prev) => ({ ...prev, parties: partyErrors }));

    setTimeout(() => {
      setInvalidFields((prev) => ({
        ...prev,
        parties: prev.parties.map(() => ({
          name: false,
          role: false,
          id_number: false,
        })),
      }));
    }, 2000);

    return isValid;
  };

  // save agreement
  const saveAgreement = async () => {
    if (!validateForm()) return;

    if (!user) {
      alert('You must be logged in to create an agreement');
      return;
    }

    setLoading(true);
    try {
      const agreement = await agreementStorage.create(user.email, {
        title: title.trim(),
        terms: terms.trim(),
        status: 'draft',
      });

      const partiesData = parties.map((party) => ({
        agreement_id: agreement.id,
        name: party.name.trim(),
        role: party.role.trim(),
        id_number: party.id_number.toString(),
      }));

      await partyStorage.createMultiple(partiesData);

      setTitle('');
      setTerms('');
      setParties([{ name: '', role: '', id_number: 0 }]);
      setInvalidFields({ title: false, terms: false, parties: [] });
      router.push(`/+tabs/Agreements`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={CreateAgreementstyles.container}>
      <View style={CreateAgreementstyles.content}>
        <Text style={CreateAgreementstyles.titleAndterms}>Title and Terms</Text>

        {/* 🔸 Title */}
        <Animated.View
          style={{
            position: 'relative',
            opacity: fadeTitle.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1],
            }),
          }}
        >
          <Animated.View
            style={{
              borderWidth: invalidFields.title ? 1 : 0,
              borderColor: fadeTitle.interpolate({
                inputRange: [0, 1],
                outputRange: ['transparent', 'red'],
              }),
              borderRadius: 5,
            }}
          >
            <TextInput
              style={[CreateAgreementstyles.input]}
              value={title}
              onChangeText={setTitle}
              placeholder="Agreement Title"
              placeholderTextColor="#9ca3af"
            />
          </Animated.View>

          {invalidFields.title && (
            <Animated.View
              style={{
                opacity: fadeTitle,
                position: 'absolute',
                right: 10,
                top: 10,
              }}
            >
              <AlertCircle size={20} color="red" />
            </Animated.View>
          )}
        </Animated.View>

        {/* 🔸 Terms */}
        <Animated.View
          style={{
            position: 'relative',
            marginTop: 10,
            borderWidth: invalidFields.terms ? 1 : 0,
            borderColor: fadeTerms.interpolate({
              inputRange: [0, 1],
              outputRange: ['transparent', 'red'],
            }),
            borderRadius: 5,
          }}
        >
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
          {invalidFields.terms && (
            <Animated.View
              style={{
                opacity: fadeTerms,
                position: 'absolute',
                right: 10,
                top: 10,
              }}
            >
              <AlertCircle size={20} color="red" />
            </Animated.View>
          )}
        </Animated.View>

        <View style={CreateAgreementstyles.divider} />

        {/* 🔸 Parties */}
        <View style={CreateAgreementstyles.partySectionWrapper}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
            {parties.map((party, i) => (
              <View key={i} style={{ marginBottom: 15 }}>
                <View style={CreateAgreementstyles.partyHeader}>
                  <Text style={CreateAgreementstyles.partyLabel}>
                    Party {i + 1}
                  </Text>
                  {parties.length > 1 && (
                    <TouchableOpacity onPress={() => removeParty(i)}>
                      <Trash2 size={18} color="#ca1212ff" />
                    </TouchableOpacity>
                  )}
                </View>

                {(['name', 'role', 'id_number'] as const).map((field, j) => (
                  <Animated.View
                    key={field}
                    style={{
                      position: 'relative',
                      marginBottom: 8,
                      borderWidth:
                        invalidFields.parties[i]?.[field] && fadeParties[i]
                          ? 1
                          : 0,
                      borderColor: fadeParties[i]?.[j]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['transparent', 'red'],
                      }),
                      borderRadius: 5,
                    }}
                  >
                    <TextInput
                      style={[CreateAgreementstyles.input]}
                      value={
                        field === 'id_number'
                          ? party.id_number
                            ? party.id_number.toString()
                            : ''
                          : party[field]
                      }
                      onChangeText={(v) => updateParty(i, field, v)}
                      placeholder={
                        field === 'id_number'
                          ? 'Phone No.'
                          : field === 'name'
                          ? 'Full Name'
                          : 'Role'
                      }
                      placeholderTextColor="#9ca3af"
                      keyboardType={field === 'id_number' ? 'numeric' : 'default'}
                    />
                    {invalidFields.parties[i]?.[field] && (
                      <Animated.View
                        style={{
                          opacity: fadeParties[i][j],
                          position: 'absolute',
                          right: 10,
                          top: 10,
                        }}
                      >
                        <AlertCircle size={18} color="red" />
                      </Animated.View>
                    )}
                  </Animated.View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity onPress={addParty} style={CreateAgreementstyles.addButton}>
          <Plus size={18} color="#6b7280" />
          <Text style={CreateAgreementstyles.addButtonText}>Add Party</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            CreateAgreementstyles.saveButton,
            loading && CreateAgreementstyles.saveButtonDisabled,
            { borderRadius: 25 },
          ]}
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
