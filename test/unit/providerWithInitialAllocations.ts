import * as os from "os";
import * as path from "path";

import { NativeClarityBinProvider } from "@blockstack/clarity";
import { ProviderConstructor } from "@blockstack/clarity/lib/core/provider";
import { InitialAllocation } from "@blockstack/clarity/lib/providers/clarityBin";
import { getDefaultBinaryFilePath } from "@blockstack/clarity-native-bin";

export function getTempFilePath(fileNameTemplate = "temp-{uniqueID}-file") {
  const uniqueID = `${(Date.now() / 1000) | 0}-${Math.random()
    .toString(36)
    .substr(2, 6)}`;
  const fileName = fileNameTemplate.replace("{uniqueID}", uniqueID);
  return path.join(os.tmpdir(), fileName);
}

export function providerWithInitialAllocations(
  allocations: InitialAllocation[]
): ProviderConstructor {
  const nativeBinFile = getDefaultBinaryFilePath();
  const tempDbPath = getTempFilePath("blockstack-local-{uniqueID}.db");

  const providerConstructor: ProviderConstructor = {
    create: () =>
      NativeClarityBinProvider.create(allocations, tempDbPath, nativeBinFile),
  };
  return providerConstructor;
}
