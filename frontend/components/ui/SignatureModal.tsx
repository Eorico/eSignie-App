import { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
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

  const handleOK = (signature: string) => {
    onSave(signature);
    setHasSignature(false);
    onClose();
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setHasSignature(false);
  };

  const handleEmpty = () => {
    setHasSignature(false);
  };

  const handleBegin = () => {
    setHasSignature(true);
  };

  const handleEnd = () => {
    signatureRef.current?.readSignature();
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
            onOK={handleOK}
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
            style={[SignatureModalstyles.saveButton, !hasSignature && SignatureModalstyles.saveButtonDisabled]}
            onPress={handleEnd}
            disabled={!hasSignature}
          >
            <Text style={SignatureModalstyles.saveButtonText}>Save Signature</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

