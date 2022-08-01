#!/bin/bash
clear;
echo "$(tput setaf 2)ATTENTION: run the walt.id SSI Kit with admin permission (sudo) or tests/3_Auditor.test.ts will fail.";
echo "$(tput setaf 2)ATTENTION: remember to set the bearerToken in tests/4_ESSIF.test.ts $(tput setaf 7)";
npm run clear;
npx jest --runInBand --coverage;