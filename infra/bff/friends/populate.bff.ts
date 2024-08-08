import { gql, GraphQLClient } from "infra/watcher/deps.ts";
import { register } from "infra/bff/mod.ts";
import startSpinner from "lib/terminalSpinner.ts";
import { getHeaders } from "infra/watcher/ingest.ts";
import { BfMediaTranscript } from "packages/bfDb/models/BfMediaTranscript.ts";
import { IBfCurrentViewerInternalAdminOmni } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
const GRAPHQL_ENDPOINT = Deno.env.get("BFI_GRAPHQL_ENDPOINT");

const client = new GraphQLClient(GRAPHQL_ENDPOINT);

async function populate() {
  // deno-lint-ignore no-console
  console.log("running populate");
  const stopSpinner = startSpinner();

  const projectIds = [
    "Project-1723985241284_f16640f7e373410ca83b7b77164dfc5f",
    "Project-1723682957544_f64f72c90bc64c40bf4019e196225cb6",
    "Project-1723533411833_6ba7e45dc861483588fe327e3b5c9dac",
    "Project-1723196710899_989587b6d3414b82b3ed396d308d55b7",
    "Project-1724148753001_acc31bd37e4c4f95b5673f2d8f54f16d",
    "Project-1723563582565_b04b11c5b23b42dc8751664333478bf7",
    "Project-1723412912933_9bb78e05a5a84deebb278ba8069b4008",
    "Project-1723351256644_5bed1bead00945a4b262e59e96bec65f",
    "Project-1723979160727_62531e9b75cb44fdbad07eac1b09a2c9",
    "Project-1723332508966_1ea3ab11f9b34b40bc1eb77274f408f7",
    "Project-1723332508966_1ea3ab11f9b34b40bc1eb77274f408f7",
    "Project-1723426179563_9552726814f040718d3786282cdb0e11",
    "Project-1728195272203_9bdf31838d9c421e8fb25236e2bce93a",
    "Project-1724156070631_15e42046e29b4e0199bd3dcefac2de1f",
    "Project-1723490042321_10355a691f5b4a97a4ef1db7ea2bcdfe",
    "Project-1723799438964_447cc826cebe4ae9b74b1b0ee4588ce5",
    "Project-1725569568401_2efaae01a4054aa88a65643790a0e28a",
    "Project-1725599821627_2afb2a2e092d4db985bd74205d1b427f",
    "Project-1725317957192_7e7e10de7230478a972534498ef2a030",
    "Project-1724208666019_738236408007426fa4ed44a70ce743f5",
    "Project-1724020094427_c163f83ff6d14decbc85e7fa6dba88e3",
    "Project-1724011956202_b9a76464c0914528bf3f039501a69f95",
    "Project-1723977605587_6481945d9b7649f4bcd75936f4ecda5c",
    "Project-1723986653285_5d9a9ce2f78c40d1967d5b6fc8172452",
    "Project-1724940057418_0d149b69662749f9846564c2cd0a2f71",
    "Project-1723441349021_6005d686abed4df19a1da053c581c974",
    "Project-1723930330246_a70348f247b84d1bbf212e250cb15b7b",
    "Project-1723906973102_4b0bf1fc0b204b0181e425aec7278dc8",
    "Project-1723913539538_18c6589556934266a761bad7d0a1021d",
    "Project-1723897192327_6d80046ec76f4010954270165cca7a98",
    "Project-1723870467595_ef120a3554d54542882532f7f6ee4700",
    "Project-1723848535627_16073522558f41d5ad6d045cd67b09a4",
    "Project-1723241027483_4d20d58074b04470912733e492fd87b4",
    "Project-1723181603892_9469f42e3ac14e2daf10e72f259e297e",
    "Project-1723716372384_22aef820dbe54c9589d257517c7caf2f",
    "Project-1723703568441_bf063a556e6341c5a5cc2c53273c9b73",
    "Project-1723661511985_90db9dde242646adac71d73d9a1b4fe9",
    "Project-1723649100220_ea427868eba84a82b3999944887ad875",
    "Project-1723101293135_38174772ac6044f197b41e4f40af4d7f",
    "Project-1723630211986_80e68e6eb8f84632afb57c97ba737380",
    "Project-1724548025249_7a1148a4f6b64bcf881acd8e3a9c52e3",
    "Project-1724534678131_4c07ab8ff527470eb9390939a8c7ba61",
    "Project-1724503079120_657cb5087da74c83b56f3390e0378dab",
    "Project-1723547723992_31f3b024e2f34c9b879ee09771c41bee",
    "Project-1723495118919_70e8e95cbd6347d9909624c5a53e62dc",
    "Project-1723458043456_ebd6e57d80fe4cc08cd71f3bcd732793",
    "Project-1723443472657_bc2466122a09455b809ad27712d3bfe8",
    "Project-1723419581633_b00e2effd8b04ec1b154b70b38814ff3",
    "Project-1723405945177_ed36f534ce6343e7bd8c6951bebc9f55",
    "Project-1723345437111_9b0951d0b6294cbfa905508a8eaa2dfb",
    "Project-1723309504999_905b1b85ed5a40e2a952afcf36aaba36",
    "Project-1723562831736_0c5c0e65bc064a97839a93ece2a443a1",
    "Project-1723497451850_90266cd5d3794dd39886554a15c1077f",
    "Project-1723097505044_030a0ec688ec40afbd61f1d22ba2e12f",
    "Project-1723096051801_52945b43172745a9a60b7115b716accb",
    "Project-1723273939762_eb2d868560884388a4850bb2a82d5b2d",
    "Project-1723524256930_b7464f663e834a10a6137b56d3bd24be",
    "Project-1723512975619_1118e865c1bf4c578c38e03cd7d97243",
    "Project-1723295474106_9bdabee4c8ce49c8a8d768b8ecf8d87d",
    "Project-1723192536374_dcfe5bb84d004f328a0c592adf492f78",
    "Project-1722860301621_2a0301331a954593a9555ff7cd9c6ea4",
    "Project-1723309034957_7fbca4a059824d4da1d04d048c15b32c",
    "Project-1724098439065_d3a152b5d3b2443dabb6e1586b8dda52",
    "Project-1723899376646_e64b34e9769b4c5eb1deca801d084117",
    "Project-1723368391920_ceab6b582bbe4f019392d754a7533a3a",
    "Project-1723057186312_06178aa82357477784e4b0e1c9d19bff",
    "Project-1722553373079_691a3de0c3f844a5981af12675d34d07",
    "Project-1723491154170_fa5cb63d9c6e4e50a7fc264905cf8440",
    "Project-1722971369812_d908faba7dd24b83a1702b3cc80d5042",
  ];

  const headers = await getHeaders();

  const transcripts = [];
  for (const id of projectIds) {
    const query = gql`
      query PopulateQuery($id: ID!) {
        project(id: $id) {
          name
          transcripts(first: 1) {
            edges {
              node {
                words
              }
            }
          }
        }
      }
    `;
    const variables = { id };
    const returned = await client.request(query, variables, headers);
    // @ts-expect-error not typing this
    let filename = returned.project.name;
    if (filename.includes("justicart - Copy of ")) {
      filename = filename.replace("justicart - Copy of ", "");
    }
    // @ts-expect-error not typing this
    const words = returned.project.transcripts.edges[0].node.words;
    transcripts.push({ filename, words });
  }

  for (const transcript of transcripts) {
    const currentViewer = IBfCurrentViewerInternalAdminOmni.__DANGEROUS__create(
      import.meta,
      "bf_internal_org",
    );
    const newMedia = await BfMedia.create(currentViewer, {
      filename: transcript.filename,
    });
    const newTranscript = await BfMediaTranscript.create(currentViewer, {
      words: transcript.words,
      filename: transcript.filename,
    });
    await BfEdge.create(currentViewer, {}, {
      // @ts-expect-error idk why the metadata types are messed up for bf edges.
      bfTClassName: "BfMediaTranscript",
      bfTid: newTranscript.metadata.bfGid,
      bfSClassName: "BfMedia",
      bfSid: newMedia.metadata.bfGid,
    });
    // deno-lint-ignore no-console
    console.log(newTranscript.metadata.bfGid);
  }

  // deno-lint-ignore no-console
  console.log(`Populated ${transcripts.length} transcripts`);

  stopSpinner();
  return 0;
}

register(
  "populate",
  "Populates db with demo transcripts",
  async () => await populate(),
);
