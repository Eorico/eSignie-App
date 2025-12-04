import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckSquare, Info, ChevronRightCircle } from 'lucide-react-native';
import i18n from "@/lib/language";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AgreementType = 'rental' | 'employment' | 'Buy and Sale' | 'Non-Disclosure' | 'PartnerShip' | 'custom'

const THEME_KEY = "@theme_mode";

export default function SelectAgreement () {
    const router = useRouter();
    const { t } = useTranslation();

    const [selectedType, setSelectedType] = useState<AgreementType | null>(null);
    const scrollRef = useRef<ScrollView>(null);
    const autoScroll = useRef(true);
    const resumeEffectScroll = useRef<NodeJS.Timeout | null>(null);

    // ===========================
    // THEME STATE (sync with Settings)
    // ===========================
    const [isChocoMode, setIsChocoMode] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem(THEME_KEY);
            setIsChocoMode(savedTheme === "choco");
        };
        loadTheme();
    }, []);

    const backgroundColor = isChocoMode ? "#8B5E3C" : "#f9cfa3ff";

    // Language modal (if needed)
    const [languageModal, setLanguageModal] = useState(false);
    const [, forceUpdate] = useState(false);
    const changeLanguage = (lang: string) => {
      i18n.changeLanguage(lang).then(() => forceUpdate(prev => !prev));
      setLanguageModal(false);
    };

    const agreementObjects = [
        { id: 'rental', title: t('selectAgreement.rental'), description: t('selectAgreement.rentalSubtext'), img: require("../../assets/images/Rental.png") },
        { id: 'employment', title: t('selectAgreement.employment'), description: t('selectAgreement.employmentSubtext'), img: require("../../assets/images/Employment.png") },
        { id: 'Buy and Sale', title: t('selectAgreement.BandA'), description: t('selectAgreement.BandAsubtext'), img: require("../../assets/images/BuyAndSale.png") },
        { id: 'PartnerShip', title: t('selectAgreement.partnerShip'), description: t('selectAgreement.partnerShipSubtext'), img: require("../../assets/images/Partnership.png") },
        { id: 'Non-Disclosure', title: t('selectAgreement.NandA'), description: t('selectAgreement.NandAsubtext'), img: require("../../assets/images/NonDisclosure.png") },
        { id: 'custom', title: t('selectAgreement.custom'), description: t('selectAgreement.customSubtext'), img: require("../../assets/images/custom.png") },
    ];

    const handleSelectType = (typeId: string) => {
    const selected = typeId as AgreementType; // assert the type
    setSelectedType(selected);
    router.push({
      pathname:`../+createAgreement/CreateAgreement`,
      params: { type: selected },
    });
};

    // Auto-scroll effect
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
    <View style={[Selectstyles.container, { backgroundColor }]}>
      <View style={Selectstyles.header}>
        <Text style={[Selectstyles.title, { color: isChocoMode ? "#F5F5F0" : "#632402ff" }]}>{t('selectAgreement.title')}</Text>
        <Text style={[Selectstyles.subtitle, { color: isChocoMode ? "#F5F5F0" : "#632402c8" }]}>{t('selectAgreement.titleSubtext1')}.</Text>
        <Text style={[Selectstyles.subtitle, { color: isChocoMode ? "#F5F5F0" : "#632402c8" }]}>{t('selectAgreement.titleSubtext2')}</Text>
      </View>

      <View style={Selectstyles.stepIndicator}>
        <View style={Selectstyles.stepContainer}>
          <View style={[Selectstyles.stepCircle, Selectstyles.stepActive]}>  
                <CheckSquare size={20} color={'#374438ff'} />
          </View>
          <Text style={[Selectstyles.stepLabel, { color: isChocoMode ? "#F5F5F0" : "#632402dd" }]}>{t('selectAgreement.step1')}</Text>
        </View>

        <View style={Selectstyles.stepLine} />

        <View style={Selectstyles.stepContainer}>
          <View style={[Selectstyles.stepCircle, {backgroundColor: '#f5aaaaff'}]}>
                <Info size={20}/>
          </View>
          <Text style={[Selectstyles.stepLabel, { color: isChocoMode ? "#F5F5F0" : "#632402dd" }]}>{t('selectAgreement.step2')}</Text>
        </View>

        <View style={Selectstyles.stepLine} />

        <View style={Selectstyles.stepContainer}>
          <View style={[Selectstyles.stepCircle, {backgroundColor: '#f0d3d3ff'}]}>
            <ChevronRightCircle size={20}  />
          </View>
          <Text style={[Selectstyles.stepLabel, { color: isChocoMode ? "#F5F5F0" : "#632402dd" }]}>{t('selectAgreement.step3')}</Text>
        </View>
      </View>

      <Text style={[Selectstyles.sectionTitle, { color: isChocoMode ? "#F5F5F0" : "#632402ff" }]}>{t('selectAgreement.titleType')}</Text>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={Selectstyles.scrollView}
        contentContainerStyle={Selectstyles.horizontalContainer}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => autoScroll.current = false}
        onScrollEndDrag={() => {
            if (resumeEffectScroll.current) clearTimeout(resumeEffectScroll.current);
            resumeEffectScroll.current = setTimeout(() => autoScroll.current = true, 4000);
        }}
        onMomentumScrollEnd={() => {
            if (resumeEffectScroll.current) clearTimeout(resumeEffectScroll.current);
            resumeEffectScroll.current = setTimeout(() => autoScroll.current = true, 4000);
        }}
      >
        {agreementObjects.map((type) => {
            const Img = type.img;
            return (
                <TouchableOpacity
                    key={type.id}
                    style={[Selectstyles.card, { backgroundColor: isChocoMode ? "#61361eff20" : "#fcf4f0ff" }]}
                    onPress={() => handleSelectType(type.id)}
                    activeOpacity={0.8}
                >
                    <View style={Selectstyles.iconContainer}>
                        <Image 
                          source={Img}
                          style={{ width: 180, height: 180, marginTop: 12, borderRadius: 12 }}
                        />
                    </View>
                    <Text style={[Selectstyles.cardTitle, { color: isChocoMode ? "#F5F5F0" : "#61361eff" }]}>{type.title}</Text>
                    <Text style={[Selectstyles.cardDescription, { color: isChocoMode ? "#F5F5F0" : "#61361eff" }]}>{type.description}</Text>
                </TouchableOpacity>
            );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const Selectstyles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
  subtitle: { fontSize: 14 },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  stepContainer: { alignItems: 'center' },
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
  stepActive: { backgroundColor: '#71ed5bff' },
  stepLabel: { fontSize: 12 },
  stepLine: { width: 60, height: 2, backgroundColor: '#632402ff', marginHorizontal: 8, marginBottom: 30 },
  sectionTitle: { fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
  scrollView: { flexGrow: 0 },
  horizontalContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  card: {
    borderWidth: 1,
    borderColor: '#632402ff',
    borderRadius: 20,
    padding: 20,
    width: 380,
    height: 380,
    marginRight: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10
  },
  iconContainer: { marginBottom: 16 },
  cardTitle: { fontSize: 25, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  cardDescription: { fontSize: 14, textAlign: 'center' },
});
