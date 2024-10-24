import { gql, GraphQLClient } from "infra/watcher/deps.ts";
import { register } from "infra/bff/mod.ts";
import startSpinner from "lib/terminalSpinner.ts";
import { getHeaders } from "infra/watcher/ingest.ts";
import { BfMediaNodeTranscript } from "packages/bfDb/models/BfMediaNodeTranscript.ts";
import { IBfCurrentViewerInternalAdminOmni } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { getLogger } from "packages/logger/logger.ts";
import { BfError } from "lib/BfError.ts";
const logger = getLogger(import.meta);

type Projects = Array<{
  projectId: string;
  fileId: string | null;
}>;

async function populate(projects: Projects = accounting) {
  logger.info("running populate");
  const stopSpinner = startSpinner();

  const GRAPHQL_ENDPOINT = Deno.env.get("BFI_GRAPHQL_ENDPOINT");
  if (!GRAPHQL_ENDPOINT) {
    throw new BfError("No BFI_GRAPHQL_ENDPOINT defined");
  }

  const client = new GraphQLClient(GRAPHQL_ENDPOINT);

  const headers = await getHeaders();

  const transcripts = [];
  for (const project of projects) {
    const id = project.projectId;
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
    if (filename.includes("justicart - ")) {
      filename = filename.replace("justicart - ", "");
    }
    // @ts-expect-error not typing this
    const words = returned.project.transcripts.edges[0].node.words;
    transcripts.push({ filename, fileId: project.fileId, words });
  }

  for (const transcript of transcripts) {
    const currentViewer = IBfCurrentViewerInternalAdminOmni.__DANGEROUS__create(
      import.meta,
      "bf_internal_org",
    );
    const newMedia = await BfMedia.__DANGEROUS__createUnattached(
      currentViewer,
      {
        filename: transcript.filename,
        fileId: transcript.fileId,
      },
    );
    const newTranscript = await newMedia.createTargetNode(
      BfMediaNodeTranscript,
      {
        words: transcript.words,
        filename: transcript.filename,
      },
    );
    logger.info(newTranscript.metadata.bfGid);
  }

  logger.info(`Populated ${transcripts.length} transcripts`);

  stopSpinner();
  return 0;
}

register(
  "populate",
  "Populates db with demo transcripts",
  async () => await populate(),
);
register(
  "populate:demo",
  "Populates db with specific client transcripts",
  async () => await populate(demo),
);

// Dan's demo
const demo = [
  {
    // "2 ChatGPT & Technical Hiring꞉ What You Need to Know - Webinar.mp4",
    fileId: "1q9TFdqIcH_xAMDdi4JMYLWM6ziJS_uvD",
    projectId: "Project-1726639055572_427cc133bf324471a6f6bbee3b48f6ce",
  },

  {
    // "3 Tech Recruiting Intensive꞉ Proven Tactics for Hiring Software Engineers.mp4",
    fileId: "1prNQtcXjwxqKjKRFJm13uzJat6gv6x9X",
    projectId: "Project-1726232104461_ee2825a992b04f56baa35519fc8a224d",
  },

  {
    // "4 How Interviewers Are Leveraging ChatGPT to Hire Developers.mp4",
    fileId: "1UlLTkAzqegdZNiJSNJwls4xYhsCaMLuI",
    projectId: "Project-1726805905103_a5273295f9e744bab009357ffe2e082e",
  },

  {
    // "7 Why Gender Bias is Still a Struggle in Tech Recruitment and What You Can Do About It.mp4",
    fileId: "1siI7a7-0GwGGCHzS0N183l4tfjCJ0D3b",
    projectId: "Project-1729648483031_04913cf395634ba980aa36a771ad0ce6",
  },

  {
    // "8 Skills-Based Hiring꞉ The Dos and Don’ts.mp4",
    fileId: "1L5_lSnGVuZ5KyKQoBhrbJqeWrTdBhzQS",
    projectId: "Project-1729654979059_013aae378250409885c16e3e740c2758",
  },

  {
    // "9 Tech Recruitment Trends꞉ What to Plan For in 2024.mp4",
    fileId: "1DkTOhRsYw0MdHPul66gs80jfR9SL_rEj",
    projectId: "Project-1726232387735_5089955d13e948978942135c655cf53d",
  },

  {
    // "10 Skills-Based Hiring꞉ An Old Practice With New Power.mp4",
    fileId: "1gUvuUnsLl0RxMRqFJ7sYv8S0b9Ijjbnt",
    projectId: "Project-1726502322152_2f3fa1d8a24d42438e65ef4bd0abe1ff",
  },

  {
    // "12 AI & Bias in Tech Recruitment.mp4",
    fileId: "1TYPTgb9LA7lcPZ7CVn7B8RDIeh6mQ9xa",
    projectId: "Project-1726542089572_46bed4ad61c74fee915e7317129af9f2",
  },

  {
    // "13 Enhancing Hiring Practices through Skills Based Talent Acquisition - Ere Media.mp4",
    fileId: "1tm_uzDuSfjWgE_KEy1DlU-deJPlioY9P",
    projectId: "Project-1729788737250_d144c7fcb1e34e13aa854b9415117be4",
  },

  {
    // "14 Spring 2024꞉ What’s New in CoderPad Webinar.mp4",
    fileId: "1lnQ7aV_ztl5c7fXqqbESORLkCea7CYrd",
    projectId: "Project-1728260453318_f236c3b309da461a916cea0edcc716e4",
  },

  {
    // "15 How to Successfully Apply AI to Your Tech Hiring.mp4",
    fileId: "1rxRQRMjGhBNvWdGlaZPAx-GAjd00lm1G",
    projectId: "Project-1729740769628_0054dfe464a7444f966fade5339ff268",
  },

  {
    // "16 How to Prevent and Detect Cheating in Your Tech Recruitment Process.mp4",
    fileId: "1_tdyAxIEGFKpmv5-BhP6ky8e3hgQhH61",
    projectId: "Project-1726509082740_f872d352fef347a7be461df27e7750b8",
  },

  {
    // "18 Candidate Cheating vs. Candidate Experience in IT Recruitment.mp4",
    fileId: "1znjIUrojzKRMZ1DPFfX6xm-uc7osHcPy",
    projectId: "Project-1726736983332_744a6d9f4d7748aeb9fc8c1b78b9fd42",
  },
];

// Rubio's accounting videos
const accounting = [
  {
    projectId: "Project-1723231123468_021ef47ca72e419bab26718698a90151",
    fileId: null,
  },
  {
    projectId: "Project-1723311903017_4df60744189843339dd9e5af14aed949",
    fileId: null,
  },
  {
    projectId: "Project-1723305448102_9a8fbb2cb89e40b7be57d1238f3806f0",
    fileId: null,
  },
  {
    projectId: "Project-1723236556877_1942886426eb4ce7ba033f7a96256cf4",
    fileId: null,
  },
  {
    projectId: "Project-1723764571842_4318fa5ed0294b979e96732297778dbd",
    fileId: null,
  },
  {
    projectId: "Project-1723682987061_05fc2f06e3274c1d801241fdbb2b8fc3",
    fileId: null,
  },
  {
    projectId: "Project-1723609410187_31b22a7927564f5bb6e5eafae610ae70",
    fileId: null,
  },
  {
    projectId: "Project-1723570548023_e301a19855564e56a13fbb4e47c271e8",
    fileId: null,
  },
  {
    projectId: "Project-1723516623984_cfbb072f91e146fe9346de741256987b",
    fileId: null,
  },
  {
    projectId: "Project-1723422211118_d88b94bf5f1041efb03aededaa0bef54",
    fileId: null,
  },
  {
    projectId: "Project-1723411459013_72b3a771fc8249f69c9471ad5e6262e9",
    fileId: null,
  },
  {
    projectId: "Project-1723364533005_a393e884e5ad4f2aac7acda3c24bc48c",
    fileId: null,
  },
  {
    projectId: "Project-1723351564623_4630cc08422648ff873a3aa125bb3304",
    fileId: null,
  },
  {
    projectId: "Project-1723338419956_642fb34fd4ea44698234b0f98f23a1e8",
    fileId: null,
  },
  {
    projectId: "Project-1723985241284_f16640f7e373410ca83b7b77164dfc5f",
    fileId: null,
  },
  {
    projectId: "Project-1723682957544_f64f72c90bc64c40bf4019e196225cb6",
    fileId: null,
  },
  {
    projectId: "Project-1723533411833_6ba7e45dc861483588fe327e3b5c9dac",
    fileId: null,
  },
  {
    projectId: "Project-1723196710899_989587b6d3414b82b3ed396d308d55b7",
    fileId: null,
  },
  {
    projectId: "Project-1724148753001_acc31bd37e4c4f95b5673f2d8f54f16d",
    fileId: null,
  },
  {
    projectId: "Project-1723563582565_b04b11c5b23b42dc8751664333478bf7",
    fileId: null,
  },
  {
    projectId: "Project-1723412912933_9bb78e05a5a84deebb278ba8069b4008",
    fileId: null,
  },
  {
    projectId: "Project-1723351256644_5bed1bead00945a4b262e59e96bec65f",
    fileId: null,
  },
  {
    projectId: "Project-1723979160727_62531e9b75cb44fdbad07eac1b09a2c9",
    fileId: null,
  },
  {
    projectId: "Project-1723332508966_1ea3ab11f9b34b40bc1eb77274f408f7",
    fileId: null,
  },
  {
    projectId: "Project-1723332508966_1ea3ab11f9b34b40bc1eb77274f408f7",
    fileId: null,
  },
  {
    projectId: "Project-1723426179563_9552726814f040718d3786282cdb0e11",
    fileId: null,
  },
  {
    projectId: "Project-1728195272203_9bdf31838d9c421e8fb25236e2bce93a",
    fileId: null,
  },
  {
    projectId: "Project-1724156070631_15e42046e29b4e0199bd3dcefac2de1f",
    fileId: null,
  },
  {
    projectId: "Project-1723490042321_10355a691f5b4a97a4ef1db7ea2bcdfe",
    fileId: null,
  },
  {
    projectId: "Project-1723799438964_447cc826cebe4ae9b74b1b0ee4588ce5",
    fileId: null,
  },
  {
    projectId: "Project-1725569568401_2efaae01a4054aa88a65643790a0e28a",
    fileId: null,
  },
  {
    projectId: "Project-1725599821627_2afb2a2e092d4db985bd74205d1b427f",
    fileId: null,
  },
  {
    projectId: "Project-1725317957192_7e7e10de7230478a972534498ef2a030",
    fileId: null,
  },
  {
    projectId: "Project-1724208666019_738236408007426fa4ed44a70ce743f5",
    fileId: null,
  },
  {
    projectId: "Project-1724020094427_c163f83ff6d14decbc85e7fa6dba88e3",
    fileId: null,
  },
  {
    projectId: "Project-1724011956202_b9a76464c0914528bf3f039501a69f95",
    fileId: null,
  },
  {
    projectId: "Project-1723977605587_6481945d9b7649f4bcd75936f4ecda5c",
    fileId: null,
  },
  {
    projectId: "Project-1723986653285_5d9a9ce2f78c40d1967d5b6fc8172452",
    fileId: null,
  },
  {
    projectId: "Project-1724940057418_0d149b69662749f9846564c2cd0a2f71",
    fileId: null,
  },
  {
    projectId: "Project-1723441349021_6005d686abed4df19a1da053c581c974",
    fileId: null,
  },
  {
    projectId: "Project-1723930330246_a70348f247b84d1bbf212e250cb15b7b",
    fileId: null,
  },
  {
    projectId: "Project-1723906973102_4b0bf1fc0b204b0181e425aec7278dc8",
    fileId: null,
  },
  {
    projectId: "Project-1723913539538_18c6589556934266a761bad7d0a1021d",
    fileId: null,
  },
  {
    projectId: "Project-1723897192327_6d80046ec76f4010954270165cca7a98",
    fileId: null,
  },
  {
    projectId: "Project-1723870467595_ef120a3554d54542882532f7f6ee4700",
    fileId: null,
  },
  {
    projectId: "Project-1723848535627_16073522558f41d5ad6d045cd67b09a4",
    fileId: null,
  },
  {
    projectId: "Project-1723241027483_4d20d58074b04470912733e492fd87b4",
    fileId: null,
  },
  {
    projectId: "Project-1723181603892_9469f42e3ac14e2daf10e72f259e297e",
    fileId: null,
  },
  {
    projectId: "Project-1723716372384_22aef820dbe54c9589d257517c7caf2f",
    fileId: null,
  },
  {
    projectId: "Project-1723703568441_bf063a556e6341c5a5cc2c53273c9b73",
    fileId: null,
  },
  {
    projectId: "Project-1723661511985_90db9dde242646adac71d73d9a1b4fe9",
    fileId: null,
  },
  {
    projectId: "Project-1723649100220_ea427868eba84a82b3999944887ad875",
    fileId: null,
  },
  {
    projectId: "Project-1723101293135_38174772ac6044f197b41e4f40af4d7f",
    fileId: null,
  },
  {
    projectId: "Project-1723630211986_80e68e6eb8f84632afb57c97ba737380",
    fileId: null,
  },
  {
    projectId: "Project-1724548025249_7a1148a4f6b64bcf881acd8e3a9c52e3",
    fileId: null,
  },
  {
    projectId: "Project-1724534678131_4c07ab8ff527470eb9390939a8c7ba61",
    fileId: null,
  },
  {
    projectId: "Project-1724503079120_657cb5087da74c83b56f3390e0378dab",
    fileId: null,
  },
  {
    projectId: "Project-1723547723992_31f3b024e2f34c9b879ee09771c41bee",
    fileId: null,
  },
  {
    projectId: "Project-1723495118919_70e8e95cbd6347d9909624c5a53e62dc",
    fileId: null,
  },
  {
    projectId: "Project-1723458043456_ebd6e57d80fe4cc08cd71f3bcd732793",
    fileId: null,
  },
  {
    projectId: "Project-1723443472657_bc2466122a09455b809ad27712d3bfe8",
    fileId: null,
  },
  {
    projectId: "Project-1723419581633_b00e2effd8b04ec1b154b70b38814ff3",
    fileId: null,
  },
  {
    projectId: "Project-1723405945177_ed36f534ce6343e7bd8c6951bebc9f55",
    fileId: null,
  },
  {
    projectId: "Project-1723345437111_9b0951d0b6294cbfa905508a8eaa2dfb",
    fileId: null,
  },
  {
    projectId: "Project-1723309504999_905b1b85ed5a40e2a952afcf36aaba36",
    fileId: null,
  },
  {
    projectId: "Project-1723562831736_0c5c0e65bc064a97839a93ece2a443a1",
    fileId: null,
  },
  {
    projectId: "Project-1723497451850_90266cd5d3794dd39886554a15c1077f",
    fileId: null,
  },
  {
    projectId: "Project-1723097505044_030a0ec688ec40afbd61f1d22ba2e12f",
    fileId: null,
  },
  {
    projectId: "Project-1723096051801_52945b43172745a9a60b7115b716accb",
    fileId: null,
  },
  {
    projectId: "Project-1723273939762_eb2d868560884388a4850bb2a82d5b2d",
    fileId: null,
  },
  {
    projectId: "Project-1723524256930_b7464f663e834a10a6137b56d3bd24be",
    fileId: null,
  },
  {
    projectId: "Project-1723512975619_1118e865c1bf4c578c38e03cd7d97243",
    fileId: null,
  },
  {
    projectId: "Project-1723295474106_9bdabee4c8ce49c8a8d768b8ecf8d87d",
    fileId: null,
  },
  {
    projectId: "Project-1723192536374_dcfe5bb84d004f328a0c592adf492f78",
    fileId: null,
  },
  {
    projectId: "Project-1722860301621_2a0301331a954593a9555ff7cd9c6ea4",
    fileId: null,
  },
  {
    projectId: "Project-1723309034957_7fbca4a059824d4da1d04d048c15b32c",
    fileId: null,
  },
  {
    projectId: "Project-1724098439065_d3a152b5d3b2443dabb6e1586b8dda52",
    fileId: null,
  },
  {
    projectId: "Project-1723899376646_e64b34e9769b4c5eb1deca801d084117",
    fileId: null,
  },
  {
    projectId: "Project-1723368391920_ceab6b582bbe4f019392d754a7533a3a",
    fileId: null,
  },
  {
    projectId: "Project-1723057186312_06178aa82357477784e4b0e1c9d19bff",
    fileId: null,
  },
  {
    projectId: "Project-1722553373079_691a3de0c3f844a5981af12675d34d07",
    fileId: null,
  },
  {
    projectId: "Project-1723491154170_fa5cb63d9c6e4e50a7fc264905cf8440",
    fileId: null,
  },
  {
    projectId: "Project-1722971369812_d908faba7dd24b83a1702b3cc80d5042",
    fileId: null,
  },
  {
    projectId: "Project-1724242456201_e03272a20e7a45fa9038c3a97445f531",
    fileId: null,
  },
  {
    projectId: "Project-1724459855953_60e0d22a433443e98d880bb382a15a7f",
    fileId: null,
  },
  {
    projectId: "Project-1723258919307_c9866049feda421ebdc3f3b4be96f6ee",
    fileId: null,
  },
  {
    projectId: "Project-1723665414286_8386281e49734ae4b767f0b1c273b548",
    fileId: null,
  },
  {
    projectId: "Project-1723790257809_fe002d03da1245fdb5882f97dd873b4c",
    fileId: null,
  },
  {
    projectId: "Project-1723800118258_05dcbf17914448e38619035947d72c06",
    fileId: null,
  },
  {
    projectId: "Project-1723891939859_4fd69241810e4d8386d44d5931f73b8f",
    fileId: null,
  },
  {
    projectId: "Project-1723950731933_da34c14c1a834469b1ea5a75cb4f169c",
    fileId: null,
  },
  {
    projectId: "Project-1724084098145_ff4a3271b9c94d10b172f5e5b5a934c3",
    fileId: null,
  },
  {
    projectId: "Project-1724128421574_0cff7c69510d4186ada7bebb889b6724",
    fileId: null,
  },
  {
    projectId: "Project-1724216324301_d641b1ac923a4dbe8294f0eca5784861",
    fileId: null,
  },
  {
    projectId: "Project-1724225681923_1a13446d417b4ba181ded9c4eb6b2da0",
    fileId: null,
  },
  {
    projectId: "Project-1724481244250_38eed47fa1b646a4a0a3ab7d9f5d9072",
    fileId: null,
  },
  {
    projectId: "Project-1724487043693_c4919c8f61b3454897e8e6be6ad4bfd3",
    fileId: null,
  },
  {
    projectId: "Project-1723237662357_51c5215680c547998c769bc32f51c61c",
    fileId: null,
  },
  {
    projectId: "Project-1723277146288_2e29cf25b26545f99e492594d5829d21",
    fileId: null,
  },
  {
    projectId: "Project-1723299607454_cd58be9267d7417b8265fbf85866166d",
    fileId: null,
  },
  {
    projectId: "Project-1723307918042_badcbaed1d6d4eb68c3ddfb208965073",
    fileId: null,
  },
];
