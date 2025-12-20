import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../store/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    department: '',
    grade: '1',
  });
  const [showGradePicker, setShowGradePicker] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.name || !formData.department) {
      Alert.alert('오류', '필수 정보를 모두 입력해주세요.');
      return;
    }

    // grade를 숫자로 변환
    const registerData = {
      ...formData,
      grade: parseInt(formData.grade, 10),
      school: '', // 학교는 빈 문자열로 전송 (백엔드 호환성)
    };

    const result = await register(registerData);
    if (!result.success) {
      Alert.alert('회원가입 실패', result.error || '회원가입에 실패했습니다.');
    } else {
      Alert.alert('성공', '회원가입이 완료되었습니다!');
      // 회원가입 성공 시 홈 화면으로 이동 (네비게이션 처리)
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
    >
      <Text style={styles.title}>회원가입</Text>

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="이름"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      <View style={styles.pickerWrapper}>
        <Text style={styles.label}>학년</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowGradePicker(true)}
        >
          <Text style={styles.selectText}>
            {formData.grade ? `${formData.grade}학년` : '학년을 선택하세요'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerWrapper}>
        <Text style={styles.label}>학과</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowDepartmentPicker(true)}
        >
          <Text style={styles.selectText}>
            {formData.department || '학과를 선택하세요'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 학년 선택 Modal */}
      <Modal
        visible={showGradePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGradePicker(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={formData.grade}
              onValueChange={(value) =>
                setFormData({ ...formData, grade: value })
              }
            >
              <Picker.Item label="1학년" value="1" />
              <Picker.Item label="2학년" value="2" />
              <Picker.Item label="3학년" value="3" />
            </Picker>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowGradePicker(false)}
            >
              <Text style={styles.doneText}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 학과 선택 Modal */}
      <Modal
        visible={showDepartmentPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDepartmentPicker(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={formData.department}
              onValueChange={(value) =>
                setFormData({ ...formData, department: value })
              }
            >
              <Picker.Item label="로봇설계과" value="로봇설계과" />
              <Picker.Item label="로봇제어과" value="로봇제어과" />
              <Picker.Item label="로봇소프트웨어과" value="로봇소프트웨어과" />
              <Picker.Item label="로봇정보통신과" value="로봇정보통신과" />
            </Picker>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowDepartmentPicker(false)}
            >
              <Text style={styles.doneText}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>이미 계정이 있으신가요? 로그인</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#007AFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerWrapper: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
    minHeight: 60,
    justifyContent: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#000',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  doneButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

