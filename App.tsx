import {Principal} from "./src/Screens/Principal";
import {NativeBaseProvider} from "native-base";

export default function App() {
  return (
      <NativeBaseProvider>
        <Principal />
      </NativeBaseProvider>
  );
}
