import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../store/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    school: '',
    department: '',
    grade: '1',
  });
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      Alert.alert('오류', '필수 정보를 모두 입력해주세요.');
      return;
    }

    const result = await register(formData);
    if (!result.success) {
      Alert.alert('회원가입 실패', result.error || '회원가입에 실패했습니다.');
    }
  };

  return (
    <ScrollView style={styles.container}>
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

      <TextInput
        style={styles.input}
        placeholder="학교"
        value={formData.school}
        onChangeText={(text) => setFormData({ ...formData, school: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="학과"
        value={formData.department}
        onChangeText={(text) => setFormData({ ...formData, department: text })}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>학년</Text>
        <Picker
          selectedValue={formData.grade}
          style={styles.picker}
          onValueChange={(value) => setFormData({ ...formData, grade: value })}
        >
          <Picker.Item label="1학년" value="1" />
          <Picker.Item label="2학년" value="2" />
          <Picker.Item label="3학년" value="3" />
          <Picker.Item label="4학년" value="4" />
        </Picker>
      </View>

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
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
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
    overflow: 'hidden',
  },
  label: {
    padding: 10,
    fontSize: 14,
    color: '#8E8E93',
  },
  picker: {
    height: 50,
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

