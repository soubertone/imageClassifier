import React from 'react';
import {Center, FlatList, HStack, Text} from 'native-base';

type Props = {
    data: Array<ResultItemProps>
}

export type ResultItemProps = { key: number, name: string, probability: number };

export function ResultsList ({ data }: Props) {
    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.name}
            contentContainerStyle={{
                paddingTop: 10,
                paddingBottom: 100,
            }}
            showsVerticalScrollIndicator
            ListEmptyComponent={ () => (
                <Center>
                    <Text color='gray.400' fontSize='md' mt={6} textAlign='center'>
                        Nenhuma imagem selecionada
                    </Text>
                </Center>
            )}
            renderItem={({item}) => {
                return (
                    <HStack
                        bg='#c6c6c6'
                        borderWidth={1}
                        borderColor='#c6c6c6'
                        py={3}
                        px={5}
                        my={2}
                        rounded={10}
                        alignItems='center'
                        justifyContent='space-between'>
                        <Text fontSize='md' fontWeight={600} textTransform='uppercase'>
                            {item.name}
                        </Text>
                        <Text
                            fontSize='sm'
                            borderColor='#c6c6c6'
                            borderWidth={1}
                            p={2}
                            rounded={10}
                            color={item.key === 0 ? 'green.700' : 'gray.600'}
                        >
                            {`${item.probability}%`}
                        </Text>
                    </HStack>
                )
            }}
        />
    );
}
