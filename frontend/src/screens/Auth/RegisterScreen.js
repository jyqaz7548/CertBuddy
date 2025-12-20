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
  FlatList,
} from 'react-native';
import { useAuth } from '../../store/AuthContext';

const GRADES = ['1', '2', '3'];
const DEPARTMENTS = ['로봇설계과', '로봇제어과', '로봇소프트웨어과', '로봇정보통신과'];

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    department: '',
    grade: '1',
  });
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
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

      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => {
          console.log('학년 선택 버튼 클릭');
          setShowGradeModal(true);
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.label}>학년</Text>
        <Text style={styles.pickerValue}>
          {formData.grade ? `${formData.grade}학년` : '학년을 선택하세요'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => {
          console.log('학과 선택 버튼 클릭');
          setShowDepartmentModal(true);
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.label}>학과</Text>
        <Text style={styles.pickerValue}>
          {formData.department || '학과를 선택하세요'}
        </Text>
      </TouchableOpacity>

      {/* 학년 선택 Modal */}
      <Modal
        visible={showGradeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGradeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayTouchable}
            activeOpacity={1}
            onPress={() => setShowGradeModal(false)}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>학년 선택</Text>
            <FlatList
              data={GRADES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    formData.grade === item && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, grade: item });
                    setShowGradeModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      formData.grade === item && styles.modalItemTextSelected,
                    ]}
                  >
                    {item}학년
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowGradeModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 학과 선택 Modal */}
      <Modal
        visible={showDepartmentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDepartmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayTouchable}
            activeOpacity={1}
            onPress={() => setShowDepartmentModal(false)}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>학과 선택</Text>
            <FlatList
              data={DEPARTMENTS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    formData.department === item && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, department: item });
                    setShowDepartmentModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      formData.department === item && styles.modalItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDepartmentModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>취소</Text>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    minHeight: 60,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  pickerValue: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalItemSelected: {
    backgroundColor: '#E3F2FD',
  },
  modalItemText: {
    fontSize: 16,
    color: '#000',
  },
  modalItemTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#007AFF',
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

