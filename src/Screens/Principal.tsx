import React, {useState} from 'react';
import {ActivityIndicator, Image} from 'react-native';
import {StatusBar} from "expo-status-bar";
import {styles} from '../styles';
import {Box, Button, View, VStack} from "native-base";
import {ResultsList} from "../Components/ResultsList";
import {decodeJpeg} from '@tensorflow/tfjs-react-native';

import * as ImagePicker from 'expo-image-picker';
import * as tensorFlow from '@tensorflow/tfjs'
import * as mobileNet from '@tensorflow-models/mobilenet';
import * as fileSystem from 'expo-file-system';

export function Principal () {
    const [selectedImageURI, setSelectedImageURI] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dataImage, setDataImage] = useState([]);

    async function imageClassification (imageURI: string) {
        await tensorFlow.ready();
        const model = await mobileNet.load();

        const imageBase64 = await fileSystem.readAsStringAsync(imageURI, {
            encoding: fileSystem.EncodingType.Base64
        })

        const imageBuffer = tensorFlow.util.encodeString(imageBase64, 'base64').buffer;
        const raw = new Uint8Array(imageBuffer);
        const imageTensor = decodeJpeg(raw);

        return await model.classify(imageTensor);
    }

    async function handleSelectImage () {
        setIsLoading(true);
        setDataImage([]);
        setSelectedImageURI('');
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
            });

            if (!result.canceled) {
                const { uri } = result.assets[0];
                setSelectedImageURI(uri);

                //Classificar Imagem
                const classification = await imageClassification(uri);
                classification.map((item, index) => {
                    setDataImage(prevState => {
                        return [
                            ...prevState,
                            {
                                key: index,
                                name: item.className,
                                probability:  Number(Number(item.probability) * 100).toFixed(2)
                            }
                        ]
                    })
                })
            }
            setIsLoading(false);
        } catch (e) {
            console.log(e);
            setIsLoading(false)
        }
    }

    return (
        <View alignItems='center' bg='gray.900'>
            <StatusBar
                style="auto"
                backgroundColor='transparent'
                translucent
            />

            <VStack>
                <Box
                    alignItems='center'
                    mt={20}
                    borderColor='gray.300'
                    borderWidth={1}
                    borderRadius={10}
                >
                    <Image
                        source={ selectedImageURI ? { uri: selectedImageURI } : require('../Assets/image-placeholder.png')}
                        style={styles.image}
                    />
                </Box>

                <Box flex={1} py={5}>
                    {
                        isLoading ?
                            <ActivityIndicator color='#5F1BBF' style={{ marginTop: 40 }} />
                            :
                            <ResultsList data={dataImage} />
                    }
                </Box>

                <Box alignItems='center'>
                    <Button
                        bottom={1}
                        isLoading={isLoading}
                        bg='#5F1BBF'
                        _pressed={{
                            bg: '#7724ec'
                        }}
                        w='100%'
                        mb={10}
                        onPress={handleSelectImage}
                    >
                        Selecionar Imagem
                    </Button>
                </Box>
            </VStack>


        </View>
    )
}
