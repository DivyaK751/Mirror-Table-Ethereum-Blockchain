import {
    VStack,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Text
  } from "@chakra-ui/react";
  import { Image } from "@chakra-ui/react";
  import { useWeb3React } from "@web3-react/core";
  import { connectors } from "./connectors";
  
  export default function SelectWalletModal({ isOpen, closeModal }) {
    const { activate } = useWeb3React();
  
    const setProvider = (type) => {
      window.localStorage.setItem("provider", type);
    };
  
    return (
      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent w="300px">
          <ModalHeader>Select Wallet</ModalHeader>
          <ModalCloseButton
            _focus={{
              boxShadow: "none"
            }}
          />
          <ModalBody paddingBottom="1.5rem">
            <VStack>
              <Button
                variant="outline"
                onClick={() => {
                  activate(connectors.injected);
                  setProvider("injected");
                  closeModal();
                }}
                w="100%"
              >
                <HStack w="100%" justifyContent="center">
                  <Image
                    src="/mm.png"
                    alt="*"
                    width={25}
                    height={25}
                    borderRadius="3px"
                  />
                  <Text>Metamask</Text>
                </HStack>
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  