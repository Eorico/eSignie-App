import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, Briefcase, FileEdit, HomeIcon, CheckSquare, Info, ChevronRightCircle } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';

type AgreementType = 'rental' | 'employment' | 'buyAndsale' | 'nDa' | 'ParterShip' | 'custom'

export default function SelectAgreement () {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<AgreementType | null>(null);
    const scrollRef = useRef<ScrollView>(null);
    const autoScroll = useRef(true);
    const resumeEffectScroll = useRef<NodeJS.Timeout | null>(null);

    const agreementObjects = [
        {
            id: 'rental' as AgreementType,
            title: 'Rental Agreement',
            description: 'For propert rental or lease agreements.',
            icon: Home
        },
        {
            id: 'employment' as AgreementType,
            title: 'Employment Agreement',
            description: 'For hiring employees and contractors.',
            icon: Briefcase
        },
        {
            id: 'buyAndsale' as AgreementType,
            title: 'Buy and Sale Agreement',
            description: 'For purchasing and selling goods or services.',
            icon: FileEdit
        },
        {
            id: 'PartnerShip' as AgreementType,
            title: 'Partnership Agreement',
            description: 'To outline terms between business partners.',
            icon: HomeIcon
        },
        {
            id: 'nDa' as AgreementType,
            title: 'Non-Disclosure Agreement',
            description: 'To protect confidential information between parties.',
            icon: Briefcase
        },
        {
            id: 'custom' as AgreementType,
            title: 'Custom Agreement',
            description: 'Create a personalized agreement from scratch.',
            icon: FileEdit
        },
    ]

    const handleSelectType = (type: AgreementType) => {
        setSelectedType(type);
        router.push(`../+createAgreement/CreateAgreement?type=${type}`)
    };

    useEffect(() => {
        let offset = 0;
        const speed = 1;
        let interval: NodeJS.Timeout | null = null;

        const startAutoScroll = () => {
            if (interval) clearInterval(interval);
            interval = setInterval(() => {
            if (!autoScroll.current) return;
            offset += speed;
            if (scrollRef.current) {
                scrollRef.current.scrollTo({ x: offset, animated: false });
            }
            
            if (offset > agreementObjects.length * 400) offset = 0;
            }, 10);
        };

        startAutoScroll(); 

        return () => {
            if (interval) clearInterval(interval);
        };
    }, []);



    return (
    <View style={Selectstyles.container}>
      <View style={Selectstyles.header}>
        <Text style={Selectstyles.title}>Chooose Agreement Type</Text>
        <Text style={Selectstyles.subtitle}>Create legally binding agreements online.</Text>
        <Text style={Selectstyles.subtitle}>Follow this steps:</Text>
      </View>

      <View style={Selectstyles.stepIndicator}>
        <View style={Selectstyles.stepContainer}>
          <View style={[Selectstyles.stepCircle, Selectstyles.stepActive]}>  
                <CheckSquare size={20} color={'#374438ff'} />
          </View>
          <Text style={Selectstyles.stepLabel}>Select</Text>
        </View>

        <View style={Selectstyles.stepLine} />

        <View style={Selectstyles.stepContainer}>
          <View style={[Selectstyles.stepCircle, {backgroundColor: '#f5aaaaff'}]}>
                <Info size={20}/>
          </View>
          <Text style={Selectstyles.stepLabel}>Details</Text>
        </View>

        <View style={Selectstyles.stepLine} />

        <View style={Selectstyles.stepContainer}>
          <View style={[Selectstyles.stepCircle, {backgroundColor: '#f0d3d3ff'}]}>
            <ChevronRightCircle size={20}  />
          </View>
          <Text style={Selectstyles.stepLabel}>Preview</Text>
        </View>
      </View>

      <Text style={Selectstyles.sectionTitle}>Select Agreement Type</Text>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={Selectstyles.scrollView}
        contentContainerStyle={Selectstyles.horizontalContainer}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
            autoScroll.current = false; // pause scrolling when user touches
            if (resumeEffectScroll.current) clearTimeout(resumeEffectScroll.current);
        }}
        onScrollEndDrag={() => {
            if (resumeEffectScroll.current) clearTimeout(resumeEffectScroll.current);
            // resume after 4 seconds of no touch
            resumeEffectScroll.current = setTimeout(() => {
            autoScroll.current = true;
            }, 4000);
        }}
        onMomentumScrollEnd={() => {
            if (resumeEffectScroll.current) clearTimeout(resumeEffectScroll.current);
            resumeEffectScroll.current = setTimeout(() => {
            autoScroll.current = true;
            }, 4000);
          }}
      >

        {agreementObjects.map((type) => {
            const IconComponent = type.icon;
            return (
                <TouchableOpacity
                    key={type.id}
                    style={Selectstyles.card}
                    onPress={() => handleSelectType(type.id)}
                    activeOpacity={0.8}
                >
                    <View style={Selectstyles.iconContainer}>
                        <IconComponent size={48} color={"#5B5FED"} strokeWidth={2}/>
                    </View>
                    <Text style={Selectstyles.cardTitle}>{type.title}</Text>
                    <Text style={Selectstyles.cardDescription}>{type.description}</Text>
                </TouchableOpacity>
            );
        })}
        
      </Animated.ScrollView>
    </View>
  );
}

const Selectstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9cfa3ff',
  },
  header: {
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#632402ff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#632402c8',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#632402ff'
  },
  stepActive: {
    backgroundColor: '#71ed5bff',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },

  stepLabel: {
    fontSize: 12,
    color: '#632402dd',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#632402ff',
    marginHorizontal: 8,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#632402ff',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flexGrow: 0,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: 400,
    height: 400,
    marginRight: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3142',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});