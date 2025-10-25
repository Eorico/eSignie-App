import { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import { X } from 'lucide-react-native';
import { SignatureModalstyles } from '@/styles/SignatureModal_Design';

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
  const [tempSignature, setTempSignature] = useState<string | null>(null); // store temp signature

  const handleOK = (signature: string) => {
    // Instead of saving immediately, store it temporarily
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
      onSave(tempSignature); // save only when user clicks Save
      setTempSignature(null);
      setHasSignature(false);
      onClose();
    }
  };

  const handleCloseModal = () => {
    handleClear();
    onClose();
  };

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

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
            imageType="image/png"
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
