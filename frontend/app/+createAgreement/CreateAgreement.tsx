  import { useRef, useState } from 'react';
  import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Vibration,
    Animated,
  } from 'react-native';
  import { Plus, Trash2, AlertCircle, ArrowLeft } from 'lucide-react-native';
  import { agreementStorage, partyStorage } from '@/lib/LocalStorage';
  import { useRouter } from 'expo-router';
  import { CreateAgreementstyles } from '@/styles/CreateAgreement_Design';
  import { useAuth } from '../+auth/context/authContext';
  import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
  import {Picker} from '@react-native-picker/picker';
  import { PartyInput, WitnessInput } from '@/lib/interFace';

  // function logic ng paggawa ng agreement
  export default function CreateAgreement() {
    // routers
    const router = useRouter();
    const { user } = useAuth();

    // title inputs
    const [title, setTitle] = useState('');
    const [terms, setTerms] = useState('');
    const [parties, setParties] = useState<PartyInput[]>([
      { name: '', role: '', id_number: '', address: '', idType: '' },
    ]);

    const [witnesses, setWitnesses] = useState<WitnessInput[]>([
      { name: '', role: '', id_number: '', address: '', idType: '', testimony: '' },
    ]);

    // loading
    const [loading, setLoading] = useState(false);

    // invalid inputs
    const [invalidFields, setInvalidFields] = useState({
      title: false,
      terms: false,
      parties: [] as { name: boolean; role: boolean; id_number: boolean, address: boolean, idType: boolean }[],
      witnesses: [] as { name: boolean; role: boolean; id_number: boolean, address: boolean, idType: boolean, testimony: boolean }[],
    });

    const PartyHasInputsBtn = parties.some(
      p => Object.values(p).some(v => v && v.toString().trim() !== '')
    );
    const WitnessHasInputsBtn = witnesses.some(
      w => Object.values(w).some(v => v && v.toString().trim() !== '')
    );

    const showPartyBorder = !PartyHasInputsBtn && WitnessHasInputsBtn;
    const showWitnessBorder = !WitnessHasInputsBtn && PartyHasInputsBtn;

    // Fade animation states
    const [fadeTitle] = useState(new Animated.Value(0));
    const [fadeTerms] = useState(new Animated.Value(0));

    const [fadeParties, setFadeParties] = useState(
      parties.map(() => [
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0)
      ])
    );

    const [fadeWitnesses, setFadeWitnesses] = useState(
      witnesses.map(() => [
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0)
      ])
    );


    const textEditor = useRef<RichEditor>(null);

    const [currentType, setCurrentType] = useState<'party' | 'witness'>('party');

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
    const addPerson = () => {
      if (currentType === 'party')  {
        setParties([...parties, { name: '', role: '', id_number: '', address: '', idType: ''}]);
        setInvalidFields((prev) => ({
          ...prev,
          parties: [...prev.parties, { name: false, role: false, id_number: false, address: false, idType: false }],
        }));
        setFadeParties((prev) => [
          ...prev,
          [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0),new Animated.Value(0)],
        ]);
      } else {
        setWitnesses([...witnesses, { name: '', role: '', id_number: '', address: '', idType: '', testimony: ''}]);
        setInvalidFields((prev) => ({
          ...prev,
          witnesses: [...prev.witnesses, { name: false, role: false, id_number: false, address: false, idType: false, testimony: false }],
        }));
        setFadeWitnesses((prev) => [
          ...prev,
          [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)],
        ]);
      }
    };

    // delete party
    const removePerson = (index: number) => {
      if (currentType === 'party') {
        if (parties.length > 1) {
          setParties(parties.filter((_, i) => i !== index));
          setInvalidFields((prev) => ({
            ...prev,
            parties: prev.parties.filter((_, i) => i !== index),
          }));
          setFadeParties((prev) => prev.filter((_, i) => i !== index));
        }
      } else {
        if (witnesses.length > 1) {
          setWitnesses(witnesses.filter((_, i) => i !== index));
          setInvalidFields((prev) => ({
            ...prev,
            witnesses: prev.witnesses.filter((_, i) => i !== index),
          }));
          setFadeWitnesses((prev) => prev.filter((_, i) => i !== index));
        }
      }
    };

    // updating ng party 
    const updatePerson = (
      index: number,
      field: keyof PartyInput | 'testimony',
      value: string
    ) => {
      if (currentType === 'party') {
        setParties((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], [field]: value };
          return updated;
        });
      } else {
        setWitnesses((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], [field]: value };
          return updated;
        });
      }
    };

    // validation ng mga inputs 
    const validateForm = () => {
      let isValid = true;

      const partyErrors = parties.map(() => ({
        name: false,
        role: false,
        id_number: false,
        address: false,
        idType: false,
      }));

      const witnessErrors = witnesses.map(() => ({
        name: false,
        role: false,
        id_number: false,
        address: false,
        idType: false,
        testimony: false
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
      if (!terms.trim() || terms === '<br>') {
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
        if (!party.address.trim()) partyErrors[i].address = true;
        if (!party.idType.trim()) partyErrors[i].idType = true;
        if (!party.id_number || isNaN(Number(party.id_number)) || Number(party.id_number) <= 0) {
          partyErrors[i].id_number = true
        };

        if (
          partyErrors[i].name ||
          partyErrors[i].role ||
          partyErrors[i].id_number ||
          partyErrors[i].address || 
          partyErrors[i].idType
        ) {
          isValid = false;
          fadeParties[i].forEach((anim, j) => {
            if (partyErrors[i][['name', 'role', 'id_number', 'address', 'idType'][j] as keyof PartyInput]) {
              triggerFade(anim);
            }
          });
        }
      });

      witnesses.forEach((witness, i) => {
        if (!witness.name.trim()) witnessErrors[i].name = true;
        if (!witness.role.trim()) witnessErrors[i].role = true;
        if (!witness.address.trim()) witnessErrors[i].address = true;
        if (!witness.idType.trim()) witnessErrors[i].idType = true;
        if (!witness.testimony?.trim()) witnessErrors[i].testimony = true;
        if (!witness.id_number || isNaN(Number(witness.id_number))  || Number(witness.id_number) <= 0) {
          witnessErrors[i].id_number = true
        };

        if (
          witnessErrors[i].name ||
          witnessErrors[i].role ||
          witnessErrors[i].id_number ||
          witnessErrors[i].address || 
          witnessErrors[i].testimony || 
          witnessErrors[i].idType
        ) {
          isValid = false;
          fadeWitnesses[i].forEach((anim, j) => {
            if (witnessErrors[i][['name', 'role', 'id_number', 'address', 'idType'][j] as keyof PartyInput]) {
              triggerFade(anim);
            }
          });
        }
      });

      if (!isValid) Vibration.vibrate(300);
      setInvalidFields((prev) => ({ ...prev, parties: partyErrors, witnesses: witnessErrors }));

      setTimeout(() => {
        setInvalidFields((prev) => ({
          ...prev,
          parties: prev.parties.map(() => ({
            name: false,
            role: false,
            id_number: false,
            address: false,
            idType: false
          })),

          witnesses: prev.witnesses.map(() => ({ 
            name: false,
            role: false, 
            id_number: false, 
            address: false, 
            idType: false, 
            testimony: false 
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
          terms: terms,
          status: 'draft',
        });

        const partiesData = parties.map((party) => ({
          agreement_id: agreement.id,
          name: party.name.trim(),
          role: party.role.trim(),
          address: party.address.trim(),
          id_number: party.id_number.toString(),
        }));

        await partyStorage.createMultiple(partiesData);

        const witnessData = witnesses.map((witness) => ({
          agreement_id: agreement.id,
          name: witness.name.trim(),
          role: witness.role.trim(),
          id_number: witness.id_number.toString()
        }));

        


        setTitle('');
        setTerms('');
        setParties([{ name: '', role: '', id_number: '', address: '', idType: ''}]);
        setWitnesses([{ name: '', role: '', id_number: '', address: '', idType: '', testimony: ''}]);
        setInvalidFields({ title: false, terms: false, parties: [], witnesses: [] });
        router.push(`/+tabs/Agreements`);
      } finally {
        setLoading(false);
      }
    };

    // xml
    return (
      <View style={CreateAgreementstyles.container}>

        <View style={CreateAgreementstyles.header}>
          <TouchableOpacity
            style={CreateAgreementstyles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#F5F5F0" />
          </TouchableOpacity>

          <Text style={CreateAgreementstyles.headerTitle}>Create Agreement</Text>
        </View>
          
        <ScrollView 
          keyboardShouldPersistTaps= 'handled'
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{  paddingBottom: 200}}  
        >

        

          <View style={CreateAgreementstyles.content}>
            <Text style={CreateAgreementstyles.title}>Title</Text>

            {/* Title */}
            <Animated.View
              style={{
                position: 'relative',
                opacity: fadeTitle.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1],
                }),
              }}
            >
                <TextInput
                  style={[
                    CreateAgreementstyles.input,
                    {
                      borderColor: invalidFields.title ? 'red' : '#632402ff',
                      textAlign: 'center',
                      borderTopWidth: 0,
                      borderRightWidth: 0,
                      borderLeftWidth: 0,
                    }
                  ]}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Ex: E-Signie Agreement"
                  placeholderTextColor="#484b4fbd"
                />

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
            <Animated.View
              style={{
                position: 'relative',
                opacity: fadeTitle.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1],
                }),
              }}
            >
              <Text style={CreateAgreementstyles.title}>TERMS AND CONDITIONS</Text>

              {/* Toolbar (Formatting Buttons) */}
              <RichToolbar
                editor={textEditor}
                selectedIconTint="#632402ff"
                iconTint="#444"
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.heading1,
                  actions.heading2,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.setStrikethrough,
                  actions.alignLeft,
                  actions.alignCenter,
                  actions.alignRight,
                ]}
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#632402ff',
                  borderWidth: 1,
                  borderRadius: 8,
                  marginBottom: 6,
                }}
              />

              {/* Rich Text Editor */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: invalidFields.terms ? 'red' : '#632402ff',
                  borderRadius: 10,
                  backgroundColor: '#fff',
                  height: 250,  
                  overflow: 'hidden',  
                  marginBottom: 20,
                }}
              >
                <ScrollView
                  style={{ flex: 1 }}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                >
                  <RichEditor
                    ref={textEditor}
                    style={[
                      CreateAgreementstyles.textArea,
                      {
                        borderColor: invalidFields.terms ? 'red' : '#632402ff',
                        minHeight: 250,
                        borderRadius: 10,
                        padding: 10,
                        backgroundColor: '#fff',
                        marginBottom: 200,
                        zIndex: 0
                      },
                    ]}
                    placeholder="Write your Agreement Title, Terms, and Conditions here..."
                    initialContentHTML={terms}
                    onChange={(html) => setTerms(html.replace(/<[^>]*>/g, '').trim())}
                    editorStyle={{
                      backgroundColor: '#fff',
                      color: '#000',
                      placeholderColor: '#484b4fbd',
                    }}
                  />

                  {invalidFields.terms && (
                    <Animated.View
                      style={{
                        opacity: fadeTerms,
                        position: 'absolute',
                        top: '43%',
                        left: '43%',
                      }}
                    >
                      <AlertCircle size={50} color="red" />
                    </Animated.View>
                  )}
                </ScrollView>
              </View>
            </Animated.View>   
            
            <View style={CreateAgreementstyles.divider} />

            {/* 🔸 Parties */}
            <View style={[
                CreateAgreementstyles.partySectionWrapper, {
                  height: 490,
                  overflow: 'hidden'
            }]}>
              <Text style={CreateAgreementstyles.title}>PARTY'S AND WITNESSES</Text>

              <View style={{ flexDirection: 'row', marginBottom: 10 }}>

                  <TouchableOpacity
                    onPress={() => setCurrentType('party')}
                    style={{
                      flex: 1,
                      padding: 10,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      backgroundColor: currentType === 'party' ? '#9A3F3F' : '#ffffffff',
                      borderRadius: 30,
                      marginRight: 5,
                      alignItems: 'center',
                      borderWidth: showPartyBorder ? 2 : 0,
                      borderColor: showPartyBorder && fadeParties ? '#b40707ff' : 'transparent'
                    }}
                  >
                    <Text style={{ 
                      color: currentType === 'party' ? '#fff' : '#000', fontWeight: 'bold', 
                      margin: showWitnessBorder ? 5 : 0
                      }}>
                        Party
                    </Text>
                    {
                      showPartyBorder && (
                        <AlertCircle
                          size={18}
                          color="#b40707ff"
                        />
                      )
                    }
                  </TouchableOpacity>

                  <TouchableOpacity
                  onPress={() => setCurrentType('witness')}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      padding: 10,
                      backgroundColor: currentType === 'witness' ? '#9A3F3F' : '#ffffffff',
                      borderRadius: 30,
                      marginRight: 5,
                      alignItems: 'center',
                      borderWidth: showWitnessBorder ? 2 : 0,
                      borderColor: showWitnessBorder && fadeParties ? '#b40707ff' : 'transparent'
                    }}>
                    <Text  style={{ 
                      color: currentType === 'witness' ? '#fff' : '#000', fontWeight: 'bold', 
                      margin: showWitnessBorder ? 5 : 0
                      }}>
                        Witness
                    </Text>
                    {
                      showWitnessBorder && (
                        <AlertCircle 
                          size={18} 
                          color="#b40707ff"
                        />
                      )
                    }
                  </TouchableOpacity>

              </View>

              <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
                
                {(currentType === 'party' ? parties : witnesses).map((party, i) => (
                  <View key={i} style={{ marginBottom: 15 }}>
                    <View style={CreateAgreementstyles.partyHeader}>
                      <Text style={CreateAgreementstyles.partyLabel}>
                        {currentType === 'party' ? `Party ${i + 1}` : `Witness ${i + 1}`}
                      </Text>
                      {(currentType === 'party' ? parties : witnesses).length > 1 && (
                        <TouchableOpacity onPress={() => removePerson(i)}>
                          <Trash2 size={23} color="#ca1212ff" />
                        </TouchableOpacity>
                      )}
                    </View>

                    {(['name', 'role', 'id_number', 'address'] as const).map((field, j) => (
                      <Animated.View
                        key={field}
                        style={{
                          position: 'relative',
                          marginBottom: 8,
                        }}
                      >

                        <TextInput
                          style={[CreateAgreementstyles.input, {
                            borderColor: (currentType === 'party' ? invalidFields.parties[i]?.[field] : invalidFields.witnesses[i]?.[field]) && 
                            (currentType === 'party' ? fadeParties[i] : fadeWitnesses[i]) 
                            ? 'red' : '#632402ff' 
                          },
                        ]}
                          value={
                            field === 'id_number'
                              ? party.id_number || ''
                              : party[field]
                          }
                          onChangeText={(v) => updatePerson(i, field, v)}
                          placeholder={
                            
                            field === 'id_number' ? 'Phone No.' : 
                            field === 'name' ? 'Full Name' :
                            field === 'role' ? 'Role':
                            'Address'
                          }
                          placeholderTextColor="#484b4fbd"
                          keyboardType={field === 'id_number' ? 'numeric' : 'default'}
                        />
                        
                        {(currentType === 'party' ? invalidFields.parties[i]?.[field] : invalidFields.witnesses[i]?.[field]) && (
                          <Animated.View
                            style={{
                              opacity: (currentType === 'party' ? fadeParties[i][j] : fadeWitnesses[i][j]),
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

                    {currentType === 'witness' && (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: invalidFields.witnesses[i]?.testimony ? 'red' : '#632402ff',
                          borderRadius: 8,
                          minHeight: 150,
                          maxHeight: 200,
                          backgroundColor: '#fff',
                          marginBottom: 10,
                          overflow: 'hidden'
                        }}
                      >
                        <RichToolbar 
                          editor={textEditor}
                          selectedIconTint='#632402ff'
                          iconTint='#444'
                          actions={[
                            actions.setBold,
                            actions.setItalic,
                            actions.insertBulletsList,
                            actions.insertOrderedList,
                          ]}
                          style={{
                            backgroundColor: '#fff',
                            borderColor: '#632402ff',
                            borderWidth: 1,
                            borderRadius: 8,
                            marginBottom: 4,
                            height: 35,
                          }}
                        />

                        <RichEditor 
                          initialContentHTML={witnesses[i].testimony || ''}
                          onChange={(html) => updatePerson(i, 'testimony', html)}
                          editorStyle={{
                            backgroundColor: '#fff',
                            color: '#000',
                            placeholderColor: '#484b4fbd',
                            contentCSSText: 'font-size:14px; padding: 8px',
                          }}
                          placeholder='Testimony'
                          style={{
                            flex: 1,
                            minHeight: 150,
                            maxHeight: 200
                          }}
                        />
                      </View>
                    )}
                  

                  {/* ID Type Dropdown */}
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: invalidFields.parties[i]?.idType ? 'red' : '#632402ff',
                      borderRadius: 8,
                      marginBottom: 8,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Picker
                      selectedValue={party.idType}
                      onValueChange={(v) => updatePerson(i, 'idType', v)}
                    >
                      <Picker.Item label="Select ID Type" value="" />
                      <Picker.Item label="National ID" value="national" />
                      <Picker.Item label="Postal ID" value="postal" />
                      <Picker.Item label="License" value="license" />
                      <Picker.Item label="Other" value="other" />
                    </Picker>
                  </View>

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 8,
                      backgroundColor: '#632402ff',
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                    onPress={() => console.log('Upload ID for party', i)}
                  >
                    <Text style={{ color: '#fff' }}>Upload ID</Text>
                  </TouchableOpacity>

                        </View>
                      ))}
                    </ScrollView>
                  </View>

                  <TouchableOpacity onPress={addPerson} style={CreateAgreementstyles.addButton}>
                    <Plus size={18} color="#6b7280" />
                    <Text style={CreateAgreementstyles.addButtonText}>
                      {currentType === 'party' ? 'Add Party' : 'Add Witness'}
                    </Text>
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
      </View>
    );
  }
