import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import { X } from 'lucide-react-native';
import { SignatureModalstyles } from '@/styles/SignatureModal_Design';

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

  const style = `
    .m-signature-pad {
      box-shadow: none;
      border: 2px dashed #632402;
      border-radius: 12px;
      background-color: #fafafa;
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
      <View style={SignatureModalstyles.container}>
        <View style={SignatureModalstyles.header}>
          <Text style={SignatureModalstyles.title}>Sign Agreement</Text>
          <TouchableOpacity onPress={handleCloseModal}>
            <X size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <Text style={SignatureModalstyles.subtitle}>Signature for {partyName}</Text>

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
            webStyle={style}
            autoClear={false}
            penColor="#000000"
            imageType="image/png"
            backgroundColor="rgba(255,255,255,0.01)"
          />
        </View>

        <View style={SignatureModalstyles.footer}>
          <TouchableOpacity
            style={SignatureModalstyles.clearButton}
            onPress={handleClear}
          >
            <Text style={SignatureModalstyles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              SignatureModalstyles.saveButton,
              !hasSignature && SignatureModalstyles.saveButtonDisabled,
            ]}
            onPress={handleSave}       // save only when user clicks
            disabled={!hasSignature}
          >
            <Text style={SignatureModalstyles.saveButtonText}>Save Signature</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
