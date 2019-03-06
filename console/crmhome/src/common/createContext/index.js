import createProvider from './ProviderHOC';

export default function createContext(defaultValue) {
  const Provider = createProvider(defaultValue);
  const Consumer = Provider.createConsumer();
  return {
    Provider,
    Consumer,
  };
}
