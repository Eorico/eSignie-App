import React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignatureCanvas from 'react-native-signature-canvas';
import { X } from 'lucide-react-native';
import { SignatureModalstyles } from '@/styles/SignatureModal_Design';
import i18n from "@/lib/language";
import { useTranslation } from "react-i18next";

// signature component
interface SignatureModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
  partyName: string;
}

export default function SignatureModal({
  visible,
  onClose,
  onSave,
  partyName,
}: SignatureModalProps) {
  const signatureRef = useRef<any>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [tempSignature, setTempSignature] = useState<string | null>(null); 
  const [dateWaterMark, setdateWaterMark] = useState('');
  const { t } = useTranslation();
  const [languageModal, setLanguageModal] = useState(false);

  // Force re-render when language changes
  const [, forceUpdate] = React.useState(false);
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => forceUpdate(prev => !prev));
    setLanguageModal(false);
  };

  const THEME_KEY = "@theme_mode";
  const [isChocoMode, setIsChocoMode] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(THEME_KEY);
        setIsChocoMode(v === 'choco' || v === 'true' || v === 'dark');
      } catch (e) { /* ignore */ }
    })();
  }, []);

  const backgroundColor = isChocoMode ? "#8B5E3C" : "#ffffff";
  const primaryTextColor = isChocoMode ? "#F5F5F0" : "#111827";
  const canvasBorderColor = isChocoMode ? "#F5F5F0" : "#632402";
  const canvasBg = isChocoMode ? "transparent" : "#fafafa";
  const penColor = isChocoMode ? "#F5F5F0" : "#000000";

  useEffect(() => {
    if (visible) {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setdateWaterMark(formattedDate);
    }
  }, [visible]);

  const handleOK = (signature: string) => {
    setTempSignature(signature);
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setHasSignature(false);
    setTempSignature(null);
  };

  const handleEmpty = () => {
    setHasSignature(false);
    setTempSignature(null);
  };

  const handleBegin = () => {
    setHasSignature(true);
  };

  const handleEnd = () => {
    signatureRef.current?.readSignature();
  };

  const handleSave = () => {
    if (tempSignature) {
      onSave(tempSignature);  
      setTempSignature(null);
      setHasSignature(false);
      onClose();
    }
  };

  const handleCloseModal = () => {
    handleClear();
    onClose();
  };

  const webStyle = `
    .m-signature-pad {
      box-shadow: none;
      border: 2px dashed ${canvasBorderColor};
      border-radius: 12px;
      background-color: ${canvasBg};
      height: 575px;
      width: 100%;
    }

    .m-signature-pad--body {
      border: none;
      height: 575px;
      position: relative;
    }

    .m-signature-pad--body::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 1;
    }

    .m-signature-pad--body canvas {
      border-radius: 8px;
      background-color: transparent;
      position: relative;
      z-index: 2;
    }

    .m-signature-pad--footer {
      display: none;
      margin: 0px;
    }

    body {
      background-color: transparent;
    }
  `;

  // xml
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleCloseModal}
    >
      <View style={[SignatureModalstyles.container, { backgroundColor }]}>
        <View style={SignatureModalstyles.header}>
          <Text style={[SignatureModalstyles.title, { color: primaryTextColor }]}>{t('signature.title')}</Text>
          <TouchableOpacity onPress={handleCloseModal}>
            <X size={24} color={primaryTextColor} />
          </TouchableOpacity>
        </View>

        <Text style={[SignatureModalstyles.subtitle, { color: primaryTextColor }]}>{t('signature.signFor', { name: partyName })}</Text>

        <View style={SignatureModalstyles.canvasContainer}>
          <SignatureCanvas
            ref={signatureRef}
            onOK={handleOK}           // store signature instead of saving
            onEmpty={handleEmpty}
            onBegin={handleBegin}
            onEnd={handleEnd}
            descriptionText=""
            clearText="Clear"
            confirmText="Save"
            webStyle={webStyle}
            autoClear={false}
            penColor="#000000"
            imageType="image/png"
            backgroundColor="rgba(255, 254, 254, 1)"
          />
        </View>

        <View style={SignatureModalstyles.footer}>
          <TouchableOpacity
            style={SignatureModalstyles.clearButton}
            onPress={handleClear}
          >
            <Text style={SignatureModalstyles.clearButtonText}>{t('signature.clear')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              SignatureModalstyles.saveButton,
              !hasSignature && SignatureModalstyles.saveButtonDisabled,
            ]}
            onPress={handleSave}       // save only when user clicks
            disabled={!hasSignature}
          >
            <Text style={SignatureModalstyles.saveButtonText}>{t('signature.save')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
