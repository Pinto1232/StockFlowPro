import '@testing-library/jest-native/extend-expect';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn((styles) => styles),
  },
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  Image: 'Image',
  ScrollView: 'ScrollView',
  NativeModules: {},
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

beforeEach(() => {
  jest.clearAllMocks();
});

global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};