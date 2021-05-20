import React from "react";
import {
  Text, Divider
} from "@chakra-ui/react";

import { useTranslation } from 'react-i18next'; // Translations

function Interface() {
  const { t } = useTranslation();

  return (
    <>
      <Text fontSize="xl">{ t('interface') }</Text>
      <Divider />
          HERE:
          Language,
          Accesibility (read generated text? - read volume),
          Notifications (timer mode :D - mute notif.),
          save settings (idk why but should be)
          Use animations (?)
    </>
  )
}

export default Interface;