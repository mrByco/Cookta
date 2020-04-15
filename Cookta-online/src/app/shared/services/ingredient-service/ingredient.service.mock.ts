import {IngredientService} from './ingredient.service';
import {IngredientType} from '../../models/grocery/ingredient-type.model';

export class MockIngredientService extends IngredientService {

  constructor() {
    super(null, null);
  }

  public async LoadIngredients(): Promise<IngredientType[]> {

    return new Promise(async resolve => {
        let types: IngredientType[] = [];
        for (const d of (sampleJson as any)) {
          types.push(IngredientType.FromJson(d));
        }
        this.LastLoadedTypes = types;
        resolve(types);
      }
    );
  }


  SaveIngredient(type: IngredientType): Promise<IngredientType> {
    throw new Error('ingredient.service.mock.ts - SaveIngredient(type: IngredientType) is not integrated in mock service.');
  };


  public GetRandomType(): IngredientType {
    return this.LastLoadedTypes[Math.floor(Math.random() * Math.floor(this.LastLoadedTypes.length - 1))];
  }
}


const sampleJson = [{
  '_id': '5d355349772e4c00e4f887a2',
  'category': 'gyümölcs',
  'name': 'barack (nektarin)',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'b874ceda-fc03-409f-8a4b-c8710acdf395',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d43d07675d6e70035b7a598',
  'category': 'zöldség',
  'name': 'fehérrépa',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'c0a32ed0-b09f-4597-82a5-00c8578f6903',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887cd',
  'category': 'hús',
  'name': 'bacon (szalonna)',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a8e993fd-5073-479a-ab08-23e686664e75',
  'options': {'cunits': [{'type': 1, 'tobase': 20, 'id': 'b9c32200-cea0-40a8-bc4e-75b88e113eae', 'name': 'szelet'}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887c4',
  'category': 'hús',
  'name': 'marha hátszín',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '2b54209c-dd65-45cc-bf80-013fcea172a5',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f88799',
  'category': 'fűszer',
  'name': 'babérlevél',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '27e818fc-3b5a-4965-9aa0-20d817208c9b',
  'options': {'cunits': [{'id': '41638b8b-c40e-23ab-4b16-67f5a64d9f11', 'name': 'levél', 'tobase': 0.5, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887da',
  'category': 'zöldség',
  'name': 'burgonya',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '3aab28bf-3c6d-42f0-9503-30e5e9b9615e',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d562d616dc30a00340421f3',
  'category': 'fűszer',
  'name': 'natúr ételízesítő',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '398497d9-4e2e-4960-850d-5242cdaaeaaf',
  'options': {'cunits': [{'type': 2, 'tobase': 2, 'id': '20f181da-8504-4439-9c21-79d1ef7ed92a', 'name': 'teáskanál'}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f8879d',
  'category': 'gyümölcs',
  'name': 'ananász',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'dc1e25b4-b099-43ac-885a-05e2c89ba8ef',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d4a5989b02c5b00349089c1',
  'category': 'zöldség',
  'name': 'cukkini',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '2e2e700d-ec92-4d61-b149-f811c5fdfc11',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d4c2d3b7eda9a0034ec5d5a',
  'category': 'base',
  'name': 'lekvár',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '2c35b361-2de3-4878-b605-744180ae4c34',
  'options': {'cunits': [{'type': 2, 'tobase': 20, 'id': 'bd9f8ab2-3594-4b76-9fa5-d015d927ee61', 'name': 'evőkanál'}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887c5',
  'category': 'hús',
  'name': 'marhaszegy',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '3ee689c0-6bc0-4a1b-92e7-893cfb1fe4b1',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887e6',
  'category': 'zöldség',
  'name': 'paradicsom',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': true,
  'guid': '19a8f092-358c-43be-acbf-eae77493ded5',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887e7',
  'category': 'zöldség',
  'name': 'káposzta',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'e74d3104-1160-49d8-8428-ab686cb8311a',
  'options': {'cunits': [{'id': 'cbabe1d0-3f32-16a8-dc15-fc0385549f55', 'name': 'kilogramm', 'tobase': 1000, 'type': 1}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887bc',
  'category': 'hús',
  'name': 'sertés dagadó',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '3ff97fc6-edc2-4c33-a7f2-d0f664e8d726',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887ad',
  'category': 'gyümölcs',
  'name': 'csereszne',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a985b5a3-eeba-4e12-b287-d50a8c146e0d',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887cb',
  'category': 'hús',
  'name': 'csirke aprólék',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '0853d580-63c0-4e80-8a0c-5119d3ca421d',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d43b384d56bd500343f69b9',
  'category': 'tejtermék',
  'name': 'vaj',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '069475dd-4288-4d36-89fa-6f48a5bea113',
  'options': {
    'cunits': [{'type': 2, 'tobase': 8, 'id': '1e50a282-362c-434d-bc0b-c41cce23176e', 'name': 'evőkanál'}, {
      'type': 2,
      'tobase': 2,
      'id': '1f7de46e-45a9-4ace-b5bc-cbea16fe2413',
      'name': 'diónyi'
    }]
  },
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887a9',
  'category': 'gabona',
  'name': 'szöllő',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '9a1caa59-dee5-4fb5-86f2-240d2c882bd8',
  'options': {'cunits': [{'type': 1, 'tobase': 25, 'id': '9968cebe-c1b0-45a4-849b-f19a3506bf7e', 'name': 'szem'}]},
  'arhived': null
}, {
  '_id': '5d52c9fc213534003452d689',
  'category': 'fűszer',
  'name': 'morzsolt majoranna',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '52e96735-75ef-4930-b899-51b6011d88ad',
  'options': {'cunits': [{'type': 1, 'tobase': 2, 'id': '6d213052-9dd4-4a58-b782-6b70dc9b4ce7', 'name': 'evőkanál'}]},
  'arhived': null
}, {
  '_id': '5d5628fe6dc30a00340421ee',
  'category': 'base',
  'name': 'mascarpone',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'b395299d-18c3-4428-8523-1e3ee0360db8',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887ae',
  'category': 'gyümölcs',
  'name': 'ribizli',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '91104e37-d83f-4e25-809d-de74bafde83d',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887e3',
  'category': 'gabona',
  'name': 'rizs',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'd644d54f-2206-4714-b484-68ccebcdb8f2',
  'options': {'cunits': [{'type': 2, 'tobase': 150, 'id': '2b6c7495-4255-46c0-88af-b4fa7f18285c', 'name': 'csésze'}]},
  'arhived': null
}, {
  '_id': '5d42ecb37175860034c36b1b',
  'category': 'fűszer',
  'name': 'mustár',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'e1b64aff-9ecf-439f-a099-2796e3c17ee8',
  'options': {'cunits': [{'type': 1, 'tobase': 15, 'id': '011d9c71-617a-46ab-ab3a-52f71a06c0e3', 'name': 'evőkanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887ab',
  'category': 'gyümölcs',
  'name': 'meggy',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '74d188ae-a737-46fc-aaaa-b1510c156147',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887ca',
  'category': 'hús',
  'name': 'libacomb',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '86159b52-43b9-4349-bef0-2cfa7a1a25d2',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f88798',
  'category': 'fűszer',
  'name': 'egész köménymag',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '40a7660c-10d2-4605-8655-a24c321cd67b',
  'options': {'cunits': [{'type': 1, 'tobase': 2, 'id': 'teaspoon', 'name': 'teáskanál'}]},
  'arhived': null
}, {
  '_id': '5d55841d8a19190036041236',
  'category': 'base',
  'name': 'majonéz',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'cb52dde5-a09a-4d30-9e4b-63534d90923b',
  'options': {'cunits': [{'type': 2, 'tobase': 620, 'id': '81de0613-ca5d-4612-801d-4885a0318b1f', 'name': 'flakon'}]},
  'arhived': null
}, {
  '_id': '5d68c9ee82a69cb7fa9f9d1c',
  'category': 'gabona',
  'name': 'zabpehely',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '194c5db9-5f18-45ec-8733-eace673c0b96',
  'options': {'cunits': [{'type': 2, 'tobase': 15, 'id': '750f1cc2-dca2-408a-88bd-273181d80c3d', 'name': 'evőkanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887c2',
  'category': 'hús',
  'name': 'pulykamell',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'de22e694-5a30-4405-8185-80a778112af7',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887ac',
  'category': 'gyümölcs',
  'name': 'málna',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '2517e9b2-0485-4f5b-8607-d657c99d8649',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d42dc877175860034c36b19',
  'category': 'konzerv',
  'name': 'passzírozott paradicsom',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'c1946630-7df8-4120-a0a9-5a74f497ee48',
  'options': {'cunits': [{'type': 2, 'tobase': 56, 'id': 'ab95ab1e-f57a-4786-9dee-17d6d6626676', 'name': 'evőkanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887b5',
  'category': 'hús',
  'name': 'csirkeszárny',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ed0323f1-0729-46c2-b391-1e0aa78474dc',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887bb',
  'category': 'hús',
  'name': 'sertés oldalas',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'be1a9924-9368-4ed1-9809-7aa7b157fc51',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d4afa41ac204000349d7cf8',
  'category': 'fűszer',
  'name': 'vanília aroma',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'a1c317c5-bbcf-497c-9edb-8d6677238419',
  'options': {
    'cunits': [{
      'type': 1,
      'tobase': 0.005,
      'id': '11c95dd6-ef12-4ece-b3fc-66355ed833d6',
      'name': 'teáskanál',
      'shortname': null
    }]
  },
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887a3',
  'category': 'gyümölcs',
  'name': 'körte',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '443a38df-3b91-4e1c-b178-95612e3ace8e',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887ce',
  'category': 'tejtermék',
  'name': 'főzőtejszín 20%-os',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': '21b23c64-d780-471c-b5f5-4717415c330c',
  'options': {'cunits': [{'type': 0, 'tobase': 0.35, 'id': '6d67da2a-4881-47e4-a597-d46deb4b4afa', 'name': 'doboz 350 ml'}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887b8',
  'category': 'hús',
  'name': 'tarja',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '3681cc83-61b9-42cd-a0d6-97cff8b16b0a',
  'options': {'cunits': [{'type': 1, 'tobase': 18, 'id': '63c8e900-47d0-49ee-8da1-fe0a053603ab', 'name': 'szelet', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887cc',
  'category': 'hús',
  'name': 'csülök',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'ea1be7c6-a1a1-4d4f-bb28-9e759e547c1e',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d47a4bdd5b2640034a68305',
  'category': 'base',
  'name': 'élesztő (instant)',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'e300062e-7b49-4688-883b-eeaf33b95a61',
  'options': {
    'cunits': [{
      'type': 2,
      'tobase': 2,
      'id': '8ea9292a-470a-4767-ac89-736003f5cb48',
      'name': 'teáskanál',
      'shortname': null
    }, {'type': 2, 'tobase': 7, 'id': 'edd57900-f4b1-4102-8a61-a67b3ae89560', 'name': 'tasak', 'shortname': null}]
  },
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887a6',
  'category': 'gyümölcs',
  'name': 'datoja',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '2b4fc9d1-06e6-4977-8276-c89d46695082',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887dd',
  'category': 'zöldség',
  'name': 'fokhagyma',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '424971a9-74e3-4446-acae-cde805e3fed0',
  'options': {'cunits': [{'type': 1, 'tobase': 1, 'id': '27084473-f419-4c6b-951f-cc2c4ccecb5a', 'name': 'gerezd', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d43144be8ef0800346078bf',
  'category': 'zöldség',
  'name': 'tök',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '3ca2321e-5086-4bbe-861b-f92f04fb5339',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d42db277175860034c36b17',
  'category': 'fűszer',
  'name': 'kakukkfű',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ab2ae0c0-72e9-414a-8048-ebe8778c66f0',
  'options': {
    'cunits': [{
      'type': 2,
      'tobase': 1,
      'id': '524f225b-0a78-444b-b22e-a23544097dfd',
      'name': 'teáskanál',
      'shortname': null
    }, {'type': 1, 'tobase': 1, 'id': '3a714007-b627-4134-acd0-28fc35070378', 'name': 'csipet', 'shortname': null}]
  },
  'arhived': null
}, {
  '_id': '5d529538e8b90d0034b63afb',
  'category': 'gyümölcs',
  'name': 'sárgadinnye',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'f68a14ba-7ce5-48b9-a5bb-8e927804b85b',
  'options': {'cunits': [{'type': 2, 'tobase': 80, 'id': '9b96b14b-c830-44b7-bea4-d0872f14114a', 'name': 'szelet', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d5583e38a19190036041235',
  'category': 'konzerv',
  'name': 'csemegeuborka',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'a0bad327-0971-47ae-9826-8a9b6750ca69',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887ba',
  'category': 'hús',
  'name': 'sertéscomb',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '09adf190-7173-4fd0-9d72-efeda4adae38',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d5631746dc30a00340421f8',
  'category': 'zöldség',
  'name': 'zöldbab',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '06a14753-a09a-4e2c-b3fb-56857931c193',
  'options': {'cunits': [{'id': '908ca324-2ac4-2a55-a3ba-e3dc8dd6c4f6', 'name': 'dekagramm', 'tobase': 300, 'type': 1}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887db',
  'category': 'zöldség',
  'name': 'vöröshagyma',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '78ca956a-88fa-453f-b4ed-f924f2f8f8f8',
  'options': {'cunits': [{'type': 1, 'tobase': 1, 'id': 'head', 'name': 'fej'}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887b3',
  'category': 'hús',
  'name': 'csirkemellfilé',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '4ef952ae-f023-45d5-b0a3-bac424f9f160',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f8879c',
  'category': 'gabona',
  'name': 'csemegekukorica',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '209ccd8a-0884-4b1a-8817-3a4b2c078a2a',
  'options': {'cunits': [{'id': 'e0b49d6c-1964-5b7b-deb0-a0dbfeaa86ac', 'name': 'doboz', 'tobase': 340, 'type': 1}]},
  'arhived': null
}, {
  '_id': '5d4052c338f50600353e158b',
  'category': 'fűszer',
  'name': 'őrölt feketebors',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'bc4287c4-1a0b-4d81-b70b-2a3bbee46640',
  'options': {
    'cunits': [{
      'type': 2,
      'tobase': 1,
      'id': 'e1766de4-6f56-4784-9165-d5c7c66757a5',
      'name': 'teáskanál',
      'shortname': null
    }, {'type': 1, 'tobase': 1, 'id': 'cdb5aabf-b791-4eca-9684-9e92a772177f', 'name': 'ízlés szerint', 'shortname': null}]
  },
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887d7',
  'category': 'base',
  'name': 'víz',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'f3a61bd7-a656-488f-b776-63a2fcee6b3b',
  'options': {
    'cunits': [{
      'type': 0,
      'tobase': 0.004,
      'id': '7fce24d3-1e9b-4fdf-97f7-d12278a4c973',
      'name': 'teáskanál',
      'shortname': null
    }]
  },
  'arhived': null
}, {
  '_id': '5d4053a538f50600353e158c',
  'category': 'zöldség',
  'name': 'brokkoli fagyasztott',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'f46b35c0-70f9-4043-bde6-1556ca8afde1',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f88794',
  'category': 'befőtt',
  'name': 'kukorica konzerv (340 gr-os)',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'a4397527-0d35-410f-b8db-8a5b463c51c7',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887a1',
  'category': 'gyümölcs',
  'name': 'szilva',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '6da25d30-ad14-4bb8-a60b-3cafc13fa048',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887e4',
  'category': 'zöldség',
  'name': 'kelkáposzta',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '41ac9bf0-0aae-4901-9a4f-e72ba154a9e1',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d43b453d56bd500343f69bb',
  'category': 'fűszer',
  'name': 'vaníliás cukor',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'ae0f5bd7-d832-4937-a149-deee8cde6776',
  'options': {'cunits': [{'type': 1, 'tobase': 10, 'id': '25857046-89e7-4c4b-9714-bf6a51c5273d', 'name': 'csomag'}]},
  'arhived': null
}, {
  '_id': '5d4c5f415a87670034d65a1d',
  'category': 'base',
  'name': 'mák',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '9355e05d-f18c-4087-b7de-671c74b5112f',
  'options': {'cunits': [{'type': 2, 'tobase': 9, 'id': 'b76014e5-f87e-4b54-9d07-9946ad000a79', 'name': 'evőkanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887d2',
  'category': 'tejtermék',
  'name': 'tejszín',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'd46b6ea6-1e92-4224-83af-19754995475b',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d562f6c6dc30a00340421f6',
  'category': 'tejtermék',
  'name': 'joghurt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '3967229e-47e8-49e0-a8db-cc9319d183d5',
  'options': {'cunits': [{'type': 2, 'tobase': 175, 'id': '2ae46330-9f8f-4f3e-bab2-f839ddfb51d3', 'name': 'pohár'}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887b7',
  'category': 'hús',
  'name': 'füstölt szalonna',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'de17f88a-84b3-411f-8fad-1ddd01afdf3a',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d562bcf6dc30a00340421f2',
  'category': 'zöldség',
  'name': 'karalábé',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '839cefb5-d066-4e8c-ad15-2b5e290e419d',
  'options': {'cunits': [{'type': 2, 'tobase': 1, 'id': '4affb511-2a46-4e63-9a57-51338f51a538', 'name': 'fej', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d5629126dc30a00340421ef',
  'category': 'base',
  'name': 'habfixáló',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '4762d651-18f0-41ce-9a7f-d00027ce3e15',
  'options': {'cunits': [{'type': 1, 'tobase': 10, 'id': '6d255f9e-45e0-455b-8d18-bc3491bd91b1', 'name': 'csomag', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887dc',
  'category': 'zöldség',
  'name': 'hagyma',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'f1199d2a-2363-49b3-b37f-4dc14f9f3055',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d57f525634df10034508d87',
  'category': 'hús',
  'name': 'virsli',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'faf3f6aa-88c5-4c2b-8581-bbf3b70b1204',
  'options': {'cunits': [{'id': 'df819ef1-aea7-cb81-8c54-0a429496634c', 'name': 'szál', 'tobase': 80, 'shortname': '', 'type': 2}]},
  'arhived': null
}, {
  '_id': '5d4af8f9ac204000349d7cf7',
  'category': 'base',
  'name': 'barnacukor',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '7df47f64-e9e8-4088-9419-8ea7fb789b2b',
  'options': {'cunits': [{'type': 2, 'tobase': 13.7, 'id': 'cc8ffc93-e679-4f2e-a3cc-4a68fdc8fcb5', 'name': 'evőkanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887c3',
  'category': 'hús',
  'name': 'marha rostéjos',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '97cd76ed-b737-4bfa-9cbf-e67a6e5fb1c1',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d52cfdb213534003452d68b',
  'category': 'fűszer',
  'name': 'sertéssült fűszerkeverék',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ebab41ec-b4a2-4bc0-bdd7-f18af5f2df99',
  'options': {'cunits': [{'type': 1, 'tobase': 6, 'id': '422e619e-a27f-4486-9345-f569bfd4a817', 'name': 'evőkanál'}]},
  'arhived': null
}, {
  '_id': '5d6ab66482a69cb7fa2aa37f',
  'category': 'base',
  'name': 'méz',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '65b55f03-c0d8-4597-97a3-ac54392e26ed',
  'options': {'cunits': [{'type': 2, 'tobase': 21, 'id': '3046d39d-bf0f-4c1c-875f-930fedffbffe', 'name': 'evőkanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d5626706dc30a00340421ec',
  'category': 'fűszer',
  'name': 'őrölt fehér bors',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '94d134b6-fa6a-4473-a274-1052715eacc5',
  'options': {
    'cunits': [{
      'type': 2,
      'tobase': 0.5,
      'id': 'be3fcb10-0996-4022-8495-c3c49b8f39aa',
      'name': 'késhegynyi',
      'shortname': null
    }, {'type': 2, 'tobase': 1, 'id': '00191120-1037-482d-9e44-bebb8c80a650', 'name': 'teáskanál', 'shortname': null}]
  },
  'arhived': null
}, {
  '_id': '5d563e396dc30a00340421fa',
  'category': 'base',
  'name': 'mazsola',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '3b21421a-8c8d-4cfe-9f91-280395a51cff',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d43cf8875d6e70035b7a597',
  'category': 'zöldség',
  'name': 'erőspaprika',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'd52507d0-643d-47bd-87ce-984c467456e7',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887c0',
  'category': 'hús',
  'name': 'csirkecomb',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'c1fedc02-b701-4866-97ce-419bab3c7aa7',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d43d0c075d6e70035b7a599',
  'category': 'zöldség',
  'name': 'zeller',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'eb8ab1a6-fa82-4b46-b055-fa2ab7d05b0d',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f88796',
  'category': 'befőtt',
  'name': 'narancslekvár',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '62c5247a-597b-4908-a7e3-322fe0c6cc23',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d42e1ff7175860034c36b1a',
  'category': 'base',
  'name': 'kristálycukor',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ff24aab3-c0ad-4180-8f1a-7cbbb019d0e0',
  'options': {
    'cunits': [{
      'type': 2,
      'tobase': 12.6,
      'id': 'c0b7dea3-3062-4b3e-822a-d68553169ab3',
      'name': 'evőkanál',
      'shortname': null
    }, {'type': 2, 'tobase': 4.19, 'id': '6cc9f43e-5017-439f-a97b-764ed9527275', 'name': 'teáskanál', 'shortname': null}]
  },
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887bf',
  'category': 'hús',
  'name': 'egész csirke',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'e65cb6ff-46ef-4a41-90eb-80636cdb7ed5',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d4afe30ac204000349d7cfb',
  'category': 'base',
  'name': 'dió',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '028c6a0b-d852-4231-9dbd-43ccdbb642bf',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887d5',
  'category': 'base',
  'name': 'étolaj',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'aa91eecd-4f7c-4bb6-a87d-d1448db902c7',
  'options': {'cunits': [{'type': 0, 'tobase': 15, 'id': 'tablespoon', 'name': 'Evőkanál'}]},
  'arhived': null
}, {
  '_id': '5d4fc07a6b2dc00034c31f60',
  'category': 'base',
  'name': 'zselatin',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '604f5d2d-535e-4dd8-9c1d-7f7cc96def54',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d3feb3c8664320034219dc7',
  'category': 'tejtermék',
  'name': 'habtejszín 30%',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'f549a740-cbfb-47c2-b0fd-bb1fbf77f517',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887b9',
  'category': 'hús',
  'name': 'karaj',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '66a52ad5-3a88-4079-a6d5-2c9fb19570a7',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d529572e8b90d0034b63afc',
  'category': 'hús',
  'name': 'feketeerdei sonka',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'b0b803da-acbd-43bc-8850-4a5bf3ace803',
  'options': {'cunits': [{'type': 2, 'tobase': 15, 'id': '9112f50f-1251-4fed-a564-32e77a542a44', 'name': 'szelet', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d42db017175860034c36b16',
  'category': 'fűszer',
  'name': 'morzsolt oregánó',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'f4ac22fb-0f4f-4235-9b40-8e8b0c2ebe24',
  'options': {
    'cunits': [{'type': 1, 'tobase': 1, 'id': 'd29a3180-cb12-4dc9-8333-e371c55c667a', 'name': 'teáskanál'}, {
      'type': 1,
      'tobase': 4,
      'id': 'eb497d9c-5d0a-4591-9ea2-3233d2097f51',
      'name': 'evőkanál'
    }]
  },
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887c6',
  'category': 'hús',
  'name': 'marhalapocka',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '664e46b1-0051-4142-b19a-3c014b0c48a8',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887d1',
  'category': 'tejtermék',
  'name': 'főzőtejszín',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': '763d4455-26c6-4456-886c-ae5f1dc51032',
  'options': {'cunits': []},
  'arhived': false
}, {
  '_id': '5d355349772e4c00e4f887c7',
  'category': 'hús',
  'name': 'marhalábszár',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'e9d36193-4ff4-427f-9df9-52381479862f',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f88797',
  'category': 'fűszer',
  'name': 'só',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'd133d8f7-4a19-4cda-baeb-62cb519923b0',
  'options': {
    'cunits': [{'type': 2, 'tobase': 5, 'id': 'teaspoon', 'name': 'teáskanál'}, {
      'type': 2,
      'tobase': 2,
      'id': '164f22d9-5b3c-481d-b3f1-d57e7520e983',
      'name': 'csipet'
    }]
  },
  'arhived': null
}, {
  '_id': '5d4314a9e8ef0800346078c0',
  'category': 'fűszer',
  'name': 'kapor',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'bf962057-2a1e-42ec-b106-f6e49b4c0f6b',
  'options': {'cunits': [{'type': 1, 'tobase': 1, 'id': 'd509d31d-5ab8-4fef-b9f2-8d928cf4bc27', 'name': 'teáskanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d4afe16ac204000349d7cfa',
  'category': 'base',
  'name': 'sütőcsokoládé',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '8635afdd-2ff3-4659-ae89-77a329df48bb',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887b4',
  'category': 'hús',
  'name': 'darált sertéscomb',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a74bed40-ed12-43a6-acd2-972e2fad2d9f',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f8879a',
  'category': 'fűszer',
  'name': 'őrölt köménymag',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'afe13ec2-9f22-48ce-b658-37e1489fdc46',
  'options': {'cunits': [{'type': 1, 'tobase': 2, 'id': 'teaspoon', 'name': 'teáskanál'}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f8879b',
  'category': 'gabona',
  'name': 'liszt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '45b0d523-bff3-4c1d-bed1-7461253b3bf0',
  'options': {
    'cunits': [{'type': 2, 'tobase': 2.6, 'id': 'teaspoon', 'name': 'teáskanál', 'shortname': null}, {
      'type': 2,
      'tobase': 7.5,
      'id': 'b91857c2-b5cd-4db8-bfa1-e0e131ee280a',
      'name': 'evőkanál',
      'shortname': null
    }]
  },
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887c1',
  'category': 'hús',
  'name': 'pulykacomb',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'd22e289a-1187-4a0a-a80b-2774f1550a17',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887a7',
  'category': 'gyümölcs',
  'name': 'datojaszilva',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'df3039e3-2786-4318-b2b6-3dc823cd7666',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887d6',
  'category': 'base',
  'name': 'olaj',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': '199cb1cf-fd6f-4bd8-bbce-f317c2794512',
  'options': {'cunits': [{'type': 0, 'tobase': 0.015, 'id': 'tablespoon', 'name': 'Evőkanál'}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887e5',
  'category': 'zöldség',
  'name': 'kígyóuborka',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'bd8b7d5c-00c5-4c52-aeec-a97d525cf31e',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887de',
  'category': 'konzerv',
  'name': 'édes-savanyú mártás',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '198a8c28-b02b-402b-af6b-5800666edca0',
  'options': {
    'cunits': [{
      'type': 1,
      'tobase': 400,
      'id': 'a349d789-ac45-4ba7-bd47-7965ac319ad4',
      'name': 'üveg (400 gr)',
      'shortname': null
    }]
  },
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887c9',
  'category': 'hús',
  'name': 'egész kacsa',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'e0d979e4-0902-439c-835b-210b7d8f7c3c',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887b6',
  'category': 'hús',
  'name': 'kolbász',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ae70ebd4-6a7d-407e-ad45-e983c358d80c',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d43cf1575d6e70035b7a596',
  'category': 'zöldség',
  'name': 'paprika',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '36c05f45-5c6a-47a7-bccd-ddb131d4ac72',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887aa',
  'category': 'gyümölcs',
  'name': 'eper',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '76d99e4b-44e2-4055-88c7-b5ff17774f6f',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887a8',
  'category': 'gyümölcs',
  'name': 'narancs',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '032c3b0f-e4f0-464b-bbfc-ab5db000a2ac',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d52c74f213534003452d686',
  'category': 'base',
  'name': 'makaróni',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '62adc0ea-9c81-4bfc-8fb3-35925bb3df3e',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f88791',
  'category': 'base',
  'name': 'trappista sajt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '6a9a901a-5a0b-477b-8e2e-788d28e10984',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887b1',
  'category': 'hús',
  'name': 'szalonna',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '86f71c71-26c6-4c72-ba88-fb3964528742',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d43b2ebd56bd500343f69b8',
  'category': 'tejtermék',
  'name': 'tehéntúró',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '198a1863-8a8e-485e-ac70-06471da9fdd1',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d55832e8a19190036041233',
  'category': 'zöldség',
  'name': 'franciasaláta keverék fagyasztott',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ea460881-abee-4a74-a93f-7b56fb6dc8b3',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d4bd6915e76c9003427ee02',
  'category': 'tészta',
  'name': 'szélesmetélt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a7190305-b419-48c6-85f5-08dfec255696',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887e2',
  'category': 'zöldség',
  'name': 'karfiol',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '53304763-590e-4db2-b4ce-78c85ecc04a9',
  'options': {'cunits': [{'id': 'c1a7ffc8-7211-e984-6fe0-e2fc26985266', 'name': 'fej', 'tobase': 500, 'type': 1, 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d43e8937f32c50034533519',
  'category': 'gabona',
  'name': 'búzadara',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '850fe148-1064-4235-8f2f-9e98839d6d0c',
  'options': {'cunits': [{'type': 1, 'tobase': 11.3, 'id': '78a373fb-1d43-42e8-9578-3bf6880b82fa', 'name': 'evőkanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887a5',
  'category': 'gyümölcs',
  'name': 'téli gyümölcs (banán, ananász, narancs)',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a2d8f2cb-1f77-4146-a76f-57dc4afe65ec',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887e1',
  'category': 'zöldség',
  'name': 'vegyes zöldség (sárgarépa, borsó)',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '90db3070-cca3-4ce8-abfc-386719201802',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f88795',
  'category': 'befőtt',
  'name': 'eperlekvár',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '9c775a11-7ded-4e2e-9453-900919fe55bf',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d562eea6dc30a00340421f5',
  'category': 'zöldség',
  'name': 'lilahagyma',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '383475e8-90e9-4f4c-b652-9c8c448fab63',
  'options': {'cunits': [{'type': 1, 'tobase': 110, 'id': 'a3093014-60b1-4c35-95dd-ab422d364692', 'name': 'fej', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887d8',
  'category': 'fűszer',
  'name': 'leveskocka',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '631d43fc-a693-49d5-ba54-e00a57fc89b7',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887e9',
  'category': 'zöldség',
  'name': 'paradicsomlé',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': '389da597-848a-4751-92bc-1e2b83aaab9b',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d3d5f6452d1500036c0df60',
  'category': 'zöldség',
  'name': 'Reszelt káposzta',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '2958ff2f-7aee-4ee9-afd2-0cfae4e9016d',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d57f8cc634df10034508d89',
  'category': 'konzerv',
  'name': 'sűrített paradicsom 18-20%',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '6783bc0b-c0a7-40b3-ae47-7c5472682ed8',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887b2',
  'category': 'hús',
  'name': 'darált hús',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '6858920d-6978-4e2c-a5a0-44fa9bf7ed92',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887a4',
  'category': 'gyümölcs',
  'name': 'idénygyümölcs',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '5c0b9a4e-f5b5-4f4a-a07e-d482d5100726',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d56281a6dc30a00340421ed',
  'category': 'base',
  'name': 'keksz',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'd4ea8c1a-5928-4f11-8778-c6dce79a2c85',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887be',
  'category': 'hús',
  'name': 'sertés csülök',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'eadcde64-9bc6-49d5-a359-635089298f95',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d52c398213534003452d684',
  'category': 'base',
  'name': 'melegszendvicskrém',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '0bb0e1b0-c794-47c3-9db2-00fbd9842cc9',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887a0',
  'category': 'gyümölcs',
  'name': 'sárgabarack',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'd702b476-9b25-4278-9162-5e4b67551287',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f88792',
  'category': 'base',
  'name': 'tojás',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '995768fb-f3ac-4428-b37f-07ef0bbb6813',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d431512e8ef0800346078c1',
  'category': 'base',
  'name': 'tej 2,8%-os',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': '81e6d431-e190-42c4-b558-e90e680cea50',
  'options': {'cunits': [{'id': 'fabafd5c-6159-24c0-5950-5e453cb5f157', 'name': 'evőkanál', 'tobase': 0.015, 'shortname': '', 'type': 0}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887cf',
  'category': 'tejtermék',
  'name': 'tejföl (20%-os)',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'b036b2b5-49d2-4f7b-a21e-b904600767e2',
  'options': {'cunits': [{'type': 0, 'tobase': 40, 'id': '9313658e-47ae-4ed0-a653-429df68996c2', 'name': 'evőkanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887d4',
  'category': 'base',
  'name': 'napraforgóolaj',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'ac482c40-66f0-4ebe-b701-a936ba54cff7',
  'options': {'cunits': [{'type': 0, 'tobase': 0.015, 'id': 'tablespoon', 'name': 'evőkanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f8879f',
  'category': 'gyümölcs',
  'name': 'őszibarack',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '61bdfe30-62ad-4425-938d-d1de1f702573',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887e8',
  'category': 'zöldség',
  'name': 'póré hagyma',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'f8eb7b83-8a36-49fd-b22b-6a4ae60ec939',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887df',
  'category': 'zöldség',
  'name': 'sárgarépa',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '5ddfd8db-39aa-433e-ba6b-e5bc9432d3c5',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d43b3a6d56bd500343f69ba',
  'category': 'fűszer',
  'name': 'rumaroma',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'c42f0c04-add6-4f41-b5de-09269b83d2de',
  'options': {'cunits': [{'type': 0, 'tobase': 1, 'id': 'd0537c59-f4ba-4885-9ee1-8d536c86b190', 'name': 'mokkáskanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d52c1e0213534003452d683',
  'category': 'base',
  'name': 'zsemlemorzsa',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ea27083b-89df-445f-b555-68749d151360',
  'options': {'cunits': [{'type': 1, 'tobase': 7.44, 'id': '13811d31-2d07-4a81-a677-82b3dfe83527', 'name': 'evőkanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f88793',
  'category': 'befőtt',
  'name': 'zöldbab konzerv',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'a6e0a53a-dc26-4e00-84f0-e55ab6cbbecf',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f8879e',
  'category': 'gyümölcs',
  'name': 'alma',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '756c8aed-ea05-49c0-9d9f-3a1e4f521606',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887bd',
  'category': 'hús',
  'name': 'sertés lapocka',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'b29a3f76-cca0-433b-94be-ca9154628025',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d57f5bb634df10034508d88',
  'category': 'hús',
  'name': 'darált löncs hús konzerv',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '753c4c09-6f19-4100-8f04-409c9561a46a',
  'options': {'cunits': [{'type': 2, 'tobase': 400, 'id': '944b5699-7c7c-427d-8764-30fac5fbac32', 'name': 'Konzerv'}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887c8',
  'category': 'hús',
  'name': 'egész pulyka',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '0e362390-4c16-4b13-8ab8-8a5122b236e2',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887d3',
  'category': 'base',
  'name': 'olivaolaj',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': '1eb94ec0-9a37-4508-9daa-b0b9647834b8',
  'options': {'cunits': [{'type': 0, 'tobase': 15, 'id': 'tablespoon', 'name': 'evőkanál'}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887b0',
  'category': 'gyümölcs',
  'name': 'fekete ribizli',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ea9db451-bead-4ea9-8bac-7ee99a57c9bc',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887af',
  'category': 'gyümölcs',
  'name': 'málna',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'f6b1c84a-4cfc-4e2d-be10-f22b8ea4057b',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d40514e38f50600353e1589',
  'category': 'fűszer',
  'name': 'pirospaprika',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '45092d97-dc7b-40fc-9d5f-ebe0a1aa0306',
  'options': {'cunits': [{'type': 2, 'tobase': 2, 'id': '2f0dc0e7-204d-4872-8eb0-c4002ab49ad6', 'name': 'teáskanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887e0',
  'category': 'zöldség',
  'name': 'borsó',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '5c6ac8ae-c63e-4bab-8a30-30d490594e3d',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d4050ae38f50600353e1587',
  'category': 'base',
  'name': 'sertészsír',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '8f03bc9e-9475-4366-bdcf-c2f1829933b6',
  'options': {'cunits': [{'type': 2, 'tobase': 20, 'id': 'a6f81736-7332-44b0-b291-6240b43d21cc', 'name': 'evőkanál', 'shortname': null}]},
  'arhived': null
}, {
  '_id': '5d4c2b6d7eda9a0034ec5d58',
  'category': 'base',
  'name': 'porcukor',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'b7f45780-893c-4820-9626-f1d1d9dd0235',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5d4afb42ac204000349d7cf9',
  'category': 'base',
  'name': 'szódabikarbóna',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'cee40eeb-5b93-4d95-a9bd-37bdd8621cd0',
  'options': {
    'cunits': [{
      'type': 2,
      'tobase': 2,
      'id': '8d4e201c-8f5f-451b-93a6-b2a1c652c1fa',
      'name': 'teáskanál',
      'shortname': null
    }, {'type': 1, 'tobase': 0.8, 'id': '71f13398-7e91-4968-a806-7d1bb3563aa2', 'name': 'késhegynyi', 'shortname': null}]
  },
  'arhived': null
}, {
  '_id': '5d42db437175860034c36b18',
  'category': 'fűszer',
  'name': 'bazsalikom',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '6626e891-f898-4c6f-9e9a-c2977c6608ff',
  'options': {
    'cunits': [{
      'type': 1,
      'tobase': 2,
      'id': '8684e33a-6177-4563-9b0f-a8a412dae508',
      'name': 'teáskanál'
    }, {'id': '03cdc84b-fdf9-f1e6-3817-876c96e9f7a5', 'name': 'evőkanál', 'tobase': 6, 'type': 2}]
  },
  'arhived': null
}, {
  '_id': '5d355349772e4c00e4f887d0',
  'category': 'tészta',
  'name': 'spagetti tészta',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a2c81e73-39b0-4cfa-a67e-9f6319c97c0c',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e10f1218bc54cd7eb2c8eac',
  'category': 'tészta',
  'name': 'csigatészta',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ecda7943-a1df-0536-9509-4229d2db3224',
  'options': {'cunits': [{'id': 'b157e987-ecb3-74c1-85fd-942c2472af13', 'name': 'evőkanál', 'tobase': 15, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e10f2c38bc54cd7eb2cc4f7',
  'category': 'gabona',
  'name': 'lencse',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '50510a6d-bb07-8507-12f1-4e74455a9fdb',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e370df26eb15b17c03e1d00',
  'category': 'hús',
  'name': 'sertéscsont',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '6717cc56-8285-35ae-82c4-341642b47e9d',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e370df26eb15b17c03e1d0e',
  'category': 'hús',
  'name': 'marhacomb',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '173f9acf-e32c-3299-b4da-16b4d9259766',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7a460dbbde1fedac7ede20',
  'category': 'hús',
  'name': 'sonka',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ba8c440a-3adf-c884-32bc-e2ae1797b694',
  'options': {
    'cunits': [{
      'id': 'd864f758-524e-364e-e426-ac57446fc895',
      'name': 'Csomag 15dkg',
      'tobase': 150,
      'type': 0
    }, {'id': 'ac3d781e-eff0-3e3f-6e04-6b13276e301e', 'name': 'Szelet', 'tobase': 20, 'type': 0}]
  },
  'arhived': null
}, {
  '_id': '5e7a468bbbde1fedac7ef0e1',
  'category': 'base',
  'name': 'sajt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '9424a54c-7701-4208-51ca-380aa60c3a0e',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7a4dcbbbde1fedac8027dc',
  'category': 'fűszer',
  'name': 'fűszerkömény',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'fb841dec-9ae0-f1de-6985-063b8f3b5aeb',
  'options': {'cunits': [{'id': 'a750c81b-a717-7422-da3c-2b2e67d06d4c', 'name': 'teáskanál', 'tobase': 1, 'shortname': '', 'type': 0}]},
  'arhived': null
}, {
  '_id': '5e7a4edfbbde1fedac805898',
  'category': 'fűszer',
  'name': 'fűszerpaprika',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'd0c4266f-105b-e30f-e9f2-bb8874c72846',
  'options': {'cunits': [{'id': '02d33a51-8f10-1105-6209-f323092a071c', 'name': 'teáskanál', 'tobase': 2, 'type': 0}]},
  'arhived': null
}, {
  '_id': '5e7a50a3bbde1fedac80a9f5',
  'category': 'zöldség',
  'name': 'savanyúkáposzta',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'c59732b2-b74c-2e00-74dd-3cc7d2f3acbd',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7a5167bbde1fedac80ccc5',
  'category': 'base',
  'name': 'müzli',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '0654df88-5ca2-9010-277d-bacc8672a363',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7a9916bbde1fedac8ad54e',
  'category': 'fűszer',
  'name': 'gyros fűszerkeverék',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '55951ea0-a22e-6ba9-5e80-7852a7cf1378',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7b2deabbde1fedac9d6d05',
  'category': 'zöldség',
  'name': 'vörösbab konzerv (420 gr-os)',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '110aea1e-5009-54a1-347e-39e68b6ae8f5',
  'options': {'cunits': [{'id': '05f4d25c-daad-e082-11a4-a354ef031a3a', 'name': 'doboz', 'tobase': 420, 'type': 1}]},
  'arhived': null
}, {
  '_id': '5e7b6a58bbde1fedaca5df0f',
  'category': 'zöldség',
  'name': 'fagyasztott zöldség',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'b35a378e-4901-5a19-3118-73c321f0fcc7',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7c76b1bbde1fedacc76564',
  'category': 'hús',
  'name': 'sertéskaraj',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '9ff0b3c8-62cc-f3be-a067-7f5bd471c485',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7c7819bbde1fedacc79766',
  'category': 'base',
  'name': 'tojássárgája',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '4961c405-bb18-9f32-eeb2-da7b418a8873',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7c785bbbde1fedacc7a066',
  'category': 'fűszer',
  'name': 'őrölt szerecsendió',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'cfccb468-8be0-3dde-7d0b-8144aad45e6a',
  'options': {
    'cunits': [{
      'id': '02f3feb8-bf85-6056-badb-422cbc17bc18',
      'name': 'csipet',
      'tobase': 0.5,
      'type': 2
    }, {'id': 'f2857799-e8cc-c9dc-0e78-3df504b843e5', 'name': 'teáskanál', 'tobase': 2, 'type': 2}]
  },
  'arhived': null
}, {
  '_id': '5e7c78b7bbde1fedacc7ad02',
  'category': 'base',
  'name': 'reszelt sajt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ca50382a-7b89-72e8-a29e-dec3994544b3',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7c800ebbde1fedacc8a3da',
  'category': 'tészta',
  'name': 'penne tészta',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '7f48dbfa-9509-b187-6f42-62106e9c37e6',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7c8061bbde1fedacc8add1',
  'category': 'base',
  'name': 'zsemle',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '3970c643-afb9-c67a-6470-78ebfecacac3',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7c876fbbde1fedacc9affd',
  'category': 'zöldség',
  'name': 'petrezselyemgyökér',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'b943440d-88f5-85d8-d7bb-54511997409b',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7c8857bbde1fedacc9cda2',
  'category': 'tészta',
  'name': 'eperlevél tészta',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '61345dcc-19d7-1407-5637-e4b3f4bbee84',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7c8888bbde1fedacc9d405',
  'category': 'zöldség',
  'name': 'petrezselyemzöld',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'e1976498-afbc-488a-1bc1-d9bb1ccdbcfd',
  'options': {'cunits': [{'id': '2b14058d-69d6-4b14-99b6-7e14201fe499', 'name': 'evőkanál', 'tobase': 5, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e7e2c64bbde1fedac098882',
  'category': 'base',
  'name': 'ananász konzerv (560 gr)',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'fa8a2752-c3d6-aaa8-91f8-2a1f3e3cc819',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e2cafbbde1fedac0991da',
  'category': 'base',
  'name': 'gyümölcslekvár',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '3e75ddb2-db3e-21f1-1182-c98bef6b953d',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e2d06bbde1fedac099c1b',
  'category': 'base',
  'name': 'gyümölcsbefőtt',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '519014d7-49da-fd97-4217-df7a6cbd5af4',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e2da3bbde1fedac09ae60',
  'category': 'base',
  'name': 'mogyorókrém',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'b7861fdf-fb8a-93a4-9ad8-20f9ac730189',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e2e8dbbde1fedac09cc74',
  'category': 'base',
  'name': 'aszalt szilva',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '8fd18fae-0217-93ab-5664-950aed996157',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e2f1abbde1fedac09dd85',
  'category': 'tészta',
  'name': 'fodros nagykocka',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '39e1379e-6291-72eb-f7e8-440ab8de4ea1',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e2f2dbbde1fedac09df91',
  'category': 'base',
  'name': 'csigatészta',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'f38c57d1-5434-7111-406d-2e79a4800ffb',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e2f53bbde1fedac09e3c4',
  'category': 'base',
  'name': 'almaecet',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'c16bfbec-7a30-c5f0-368f-7d3bdaef4250',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e2f87bbde1fedac09ea2f',
  'category': 'base',
  'name': 'ketchup',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '715b0bdc-c6da-4559-b625-142565bdc1b8',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e2fc7bbde1fedac09f189',
  'category': 'base',
  'name': 'torma',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '67afe6c3-8599-0c3e-e6c1-e96fa4d442d8',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e2fddbbde1fedac09f407',
  'category': 'base',
  'name': 'kakaópor',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a1f53bea-6f9c-6bc1-fbe0-0757f9fa5a3b',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e2ff1bbde1fedac09f6df',
  'category': 'base',
  'name': 'tea',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '1d239379-2887-5568-31c9-ad424b510744',
  'options': {'cunits': [{'id': '5a417e06-dbd3-d832-5356-91bc61ac5e27', 'name': 'doboz', 'tobase': 20, 'type': 1}]},
  'arhived': null
}, {
  '_id': '5e7e3001bbde1fedac09f8aa',
  'category': 'base',
  'name': 'kávé',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '03fa6b6b-aad4-961f-712f-4b576ef45742',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e3023bbde1fedac09fce0',
  'category': 'base',
  'name': 'kávétejszín (10 db-os)',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '7964b585-4bbc-538f-a407-1970133b789f',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e305ebbde1fedac0a0433',
  'category': 'base',
  'name': 'tejszínhab',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'b9cacd81-8cbf-f139-5207-5e382c3a481a',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e308ebbde1fedac0a09c7',
  'category': 'base',
  'name': 'kukoricapehely',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'dc05fa71-3c72-2200-ab0f-c797d657ade3',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e30b2bbde1fedac0a0e75',
  'category': 'base',
  'name': 'citromlé',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': '8273f5ff-f950-b21a-d01d-e271ce7bf4e3',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e30cabbde1fedac0a10d5',
  'category': 'base',
  'name': 'ecet (10%-os)',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'a7686cb9-58ba-705b-338b-4332cc081fff',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e30d9bbde1fedac0a1297',
  'category': 'base',
  'name': 'ecet (20%-os)',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'ee9afc52-e69b-3621-397b-f9b767dc4794',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e30f0bbde1fedac0a159e',
  'category': 'base',
  'name': 'sör',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': '3a19a0a3-44e0-cf7e-27b7-852a91b5d9fd',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e3103bbde1fedac0a17e9',
  'category': 'base',
  'name': 'szódapatron',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '4913a9ed-71af-93ef-9765-c7a09aec7e64',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e311bbbde1fedac0a1b2c',
  'category': 'base',
  'name': 'ásványvíz',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'ccda111f-8cf6-1adb-b9cf-a15583957eb9',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e313bbbde1fedac0a1ee1',
  'category': 'base',
  'name': 'gyümölcslé',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': '81655b33-c601-f367-ba40-292d9229405f',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7e3145bbde1fedac0a1fbc',
  'category': 'base',
  'name': 'narancslé',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'fbfacbf7-0d1e-a195-71e9-9d5b5a434752',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7f9555bbde1fedac34b252',
  'category': 'base',
  'name': 'tej 3,5%-os',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': '96d7a9fd-9c7d-5f93-1118-8e85408530a0',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7f9564bbde1fedac34b419',
  'category': 'Base',
  'name': 'tej 1,5%-os',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': 'ee6b23ce-86c1-c81d-f45b-72f629cd7a52',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7f95e5bbde1fedac34c33a',
  'category': 'base',
  'name': 'háromnegyedes vaj',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '78f0e48c-1165-f0c4-5800-01485cceac02',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7f9645bbde1fedac34cdf7',
  'category': 'base',
  'name': 'májas',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '1247dd13-c4e3-471e-d162-400ac4a34b94',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7f96a9bbde1fedac34d976',
  'category': 'zöldség',
  'name': 'zöldségkeverék fagyasztott',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '406268da-b16c-2a0a-b578-d233b889328a',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7f96cfbbde1fedac34de43',
  'category': 'zöldség',
  'name': 'zöldborsó fagyasztott',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '799ac426-8d87-3e8a-be66-e66ab869f1da',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7f970ebbde1fedac34e57e',
  'category': 'zöldség',
  'name': 'kelbimbó fagyasztott',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '690a0396-9c36-8c4e-77d4-09410998d0cc',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e7f9721bbde1fedac34e781',
  'category': 'base',
  'name': 'gombakonzerv',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'bb8ebaa1-f3df-d43b-ce80-d29b5ccc3310',
  'options': {'cunits': [{'id': 'a58be5b5-e03a-11fd-bf96-e2c8280a1588', 'name': 'doboz', 'tobase': 230, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e81a263bbde1fedac72bc10',
  'category': 'gyümölcs',
  'name': 'citrom',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ccf52afa-b3f2-2994-a313-2c045d63249d',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81a699bbde1fedac7364b1',
  'category': 'zöldség',
  'name': 'hasábburgonya fagyasztott',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '95a4d99c-b071-8196-13f5-c1830682874a',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81b6e2bbde1fedac7584e6',
  'category': 'fűszer',
  'name': 'szemes feketebors',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '0709b77e-2866-4ca8-c088-736917320032',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81b717bbde1fedac758e92',
  'category': 'fűszer',
  'name': 'csípős fűszerpaprika',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '3e52d004-e54a-d36c-c2f9-fdcbb21545c4',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81b8c2bbde1fedac75c5e5',
  'category': 'fűszer',
  'name': 'morzsolt tárkony',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '895a3e16-4537-13bf-de0e-fb8afbe5418a',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81b91cbbde1fedac75d1df',
  'category': 'fűszer',
  'name': 'morzsolt szárított petrezselyem',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a6c8487b-dbc5-a69d-b1f1-2556e8fe7f31',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81b94bbbde1fedac75d7ce',
  'category': 'fűszer',
  'name': 'lestyán',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '8b5fdb3e-739d-f5d7-49d2-af85e050bf81',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81b95cbbde1fedac75da2e',
  'category': 'fűszer',
  'name': 'borsikafű',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'fa4d8e86-ee22-1386-c5b6-c45dd171be8e',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81b9e7bbde1fedac75ebb6',
  'category': 'fűszer',
  'name': 'rozmaring',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'f9fb4761-852c-206e-a304-b2897b2ed89f',
  'options': {
    'cunits': [{
      'id': 'bac51705-a345-aedc-a355-70c9be47ffc1',
      'name': 'evőkanál',
      'tobase': 6,
      'type': 2
    }, {'id': 'fa31d6e9-4456-29c8-5c5b-e6f531ba238c', 'name': 'teáskanál', 'tobase': 2, 'type': 2}]
  },
  'arhived': null
}, {
  '_id': '5e81b9febbde1fedac75eeb5',
  'category': 'fűszer',
  'name': 'zsálya',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'd1ddcf81-e229-636a-e06e-2bbd9b4e278c',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81bb67bbde1fedac761dd1',
  'category': 'fűszer',
  'name': 'római kömény',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a8eb13a3-498e-fa3f-f0db-daa64f6a3b94',
  'options': {'cunits': [{'id': 'd15a178d-2763-94ff-464c-70f043224575', 'name': 'teáskanál', 'tobase': 2, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e81bbc0bbde1fedac762cc4',
  'category': 'fűszer',
  'name': 'egész szerecsendió',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ef104860-dad4-4ffc-c36e-86b732b1f0eb',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81bc1fbbde1fedac7638fd',
  'category': 'fűszer',
  'name': 'őrölt fahéj',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'd417ab0c-e2db-4488-d225-b769c1454677',
  'options': {'cunits': [{'id': '18c57d2a-faeb-89a5-4ae1-a72eabea54f9', 'name': 'teáskanál', 'tobase': 2, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e81bc3ebbde1fedac763d25',
  'category': 'fűszer',
  'name': 'egész fahéj',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a63abbe6-957c-6710-1dfd-3469948e9363',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81bc69bbde1fedac76435f',
  'category': 'fűszer',
  'name': 'őrölt szegfűszeg',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '9cf9fab2-8c8f-b72b-d45d-b509c1e438d0',
  'options': {'cunits': [{'id': '18a7fee3-305c-d9cd-144d-5533a26e7503', 'name': 'teáskanál', 'tobase': 2, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e81bc91bbde1fedac7648a7',
  'category': 'fűszer',
  'name': 'egész szegfűszeg',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '72a5fd28-2418-b68b-226e-cb01545abd04',
  'options': {'cunits': [{'id': 'd57127bf-5991-7462-e488-1a7bfc6d837f', 'name': 'teáskanál', 'tobase': 1, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e81bcaebbde1fedac764c92',
  'category': 'fűszer',
  'name': 'vanília rúd',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'adb8bf13-e603-b764-3b93-cd9b1bf93299',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81bcc3bbde1fedac764f13',
  'category': 'fűszer',
  'name': 'gyömbér',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '245ec5fb-369c-057d-be4a-61854fe88c7f',
  'options': {'cunits': [{'id': 'b49f34f3-bd06-9716-f1dd-2347ad5ce632', 'name': 'teáskanál', 'tobase': 2, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e81bd12bbde1fedac765994',
  'category': 'fűszer',
  'name': 'curry',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '0c14de46-7683-3be3-3ad8-25c570dab3a0',
  'options': {'cunits': [{'id': 'b3b05f6c-5ec2-1186-2399-a53aca6e1024', 'name': 'teáskanál', 'tobase': 2, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e81bd67bbde1fedac766525',
  'category': 'fűszer',
  'name': 'őrölt chilipaprika',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '40eb1b69-c860-fe53-6449-292934108b22',
  'options': {'cunits': [{'id': '93488829-aa61-9937-6558-115f0eac87d3', 'name': 'teáskanál', 'tobase': 1, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e81bd89bbde1fedac766a21',
  'category': 'fűszer',
  'name': 'egész koriander',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '67efda3f-aacb-586c-dcd5-6fda5e113e76',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81bda2bbde1fedac766d95',
  'category': 'fűszer',
  'name': 'szegfűbors',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '0a20c0e8-e601-48b3-38d1-5dd0378c94d6',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81bdc6bbde1fedac76724c',
  'category': 'fűszer',
  'name': 'őrölt kardamom',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '64cb7159-1b5a-f646-ea92-79f08f855fb0',
  'options': {'cunits': [{'id': 'fb51d8aa-b045-101b-2183-9610233eb639', 'name': 'teáskanál', 'tobase': 2, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e81be28bbde1fedac767ebd',
  'category': 'fűszer',
  'name': 'kurkuma',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '997aa02d-c73c-9307-10ff-24d0480bb3b2',
  'options': {'cunits': [{'id': 'dfffbd09-d0e7-5b5b-fd29-c9ad12695fcd', 'name': 'teáskanál', 'tobase': 2, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e81be79bbde1fedac768a41',
  'category': 'fűszer',
  'name': 'mustármag',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '78de55ca-65a2-390a-02d6-093e806dd241',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81becabbde1fedac769673',
  'category': 'fűszer',
  'name': 'fokhagymakrém',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '2e7d2a7f-28dd-267b-7525-b950098ef4cd',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81bee1bbde1fedac76993a',
  'category': 'fűszer',
  'name': 'Piros Arany csemege',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '4f6a7772-eff1-9260-82fe-13a0f08845f0',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81bef0bbde1fedac769b47',
  'category': 'fűszer',
  'name': 'Piros Arany csípős',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '075e08e3-4de5-7436-d3c8-fc11b043af9c',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81bfcbbbde1fedac76b852',
  'category': 'base',
  'name': 'sütőpor',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '869c05da-df0c-1907-8a46-6f47f986a696',
  'options': {
    'cunits': [{
      'id': '28f31dd5-3177-cbd9-76e4-86926f771b8c',
      'name': 'tasak',
      'tobase': 12,
      'type': 2,
      'shortname': null
    }, {'id': '66119688-7c51-e12c-b4d6-bf6c999c4668', 'name': 'evőkanál', 'tobase': 12, 'type': 2, 'shortname': null}]
  },
  'arhived': null
}, {
  '_id': '5e81c04dbbde1fedac76c9cf',
  'category': 'base',
  'name': 'pudingpor',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '1f95e952-2bfd-fa33-e99e-275e2413e37d',
  'options': {
    'cunits': [{
      'id': 'edd9089c-282f-8022-3bd7-0e24e42b64d6',
      'name': 'evőkanál',
      'tobase': 12,
      'type': 2
    }, {'id': '7955fca4-729e-bf10-7c61-ebc7a6e65a8e', 'name': 'tasak', 'tobase': 50, 'type': 2}]
  },
  'arhived': null
}, {
  '_id': '5e81c071bbde1fedac76d120',
  'category': 'base',
  'name': 'szárított élesztő',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '268d9590-a17f-d09f-4560-2a28e6143b28',
  'options': {'cunits': [{'id': '4412c4a9-c47d-649f-eb59-5856c39a3d9f', 'name': 'tasak', 'tobase': 7, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e81c0b2bbde1fedac76da94',
  'category': 'base',
  'name': 'étkezési keményítő',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'b78a105a-50ab-c99f-7b20-134e514f46dc',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e81c10bbbde1fedac76e6f9',
  'category': 'base',
  'name': 'vaníliás cukor',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '364cfe29-9478-7eea-9327-e8e78c36fe47',
  'options': {
    'cunits': [{
      'id': '9eff7b66-43d7-9815-ba68-232718a11b3e',
      'name': 'evőkanál',
      'tobase': 15,
      'type': 2
    }, {'id': '220d3947-8125-5c2a-28cb-8e21f8e85328', 'name': 'tasak', 'tobase': 10, 'type': 2}]
  },
  'arhived': null
}, {
  '_id': '5e81d890bbde1fedac7a2994',
  'category': 'zöldség',
  'name': 'paraj',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'f94d10a8-b10a-c749-c636-f738915e6b0b',
  'options': {'cunits': [{'id': '58c84820-0ec9-a2b7-5bc7-fb9426a1fe47', 'name': 'doboz', 'tobase': 600, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e82092fbbde1fedac80b0e6',
  'category': 'base',
  'name': 'kockasajt Medve',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '9918e522-967f-d1d1-1c40-f9f92f10cfbf',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e8209b7bbde1fedac80c3c0',
  'category': 'base',
  'name': 'téli szalámi',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a9f6bb3c-41f5-318d-307a-f34c6620a3ce',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e820a7dbbde1fedac80de41',
  'category': 'tejtermék',
  'name': 'főzőtejszín 10%-os',
  'volumeEnabled': true,
  'countEnabled': false,
  'massEnabled': false,
  'guid': '830e6ef7-d45f-f51b-6a7d-861695f62e2b',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e820c55bbde1fedac8120cf',
  'category': 'zöldség',
  'name': 'kaliforniai paprika',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '80bfdba0-a619-172e-6228-949d633092e7',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e820cd5bbde1fedac8131cf',
  'category': 'zöldség',
  'name': 'cékla',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '6ee8bb7a-27b5-d135-6d90-d058f5184689',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e820cf9bbde1fedac813639',
  'category': 'zöldség',
  'name': 'sütőtök',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'd6dab20e-f62a-9d85-d273-83cb9b8eaa8c',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821087bbde1fedac81b125',
  'category': 'zöldség',
  'name': 'édesburgonya',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a5e780b6-79fa-fb0c-2c21-2c23651c83fe',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e8212a1bbde1fedac81f912',
  'category': 'tészta',
  'name': 'betűtészta',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '4cc8aa20-902b-6dc2-6868-18c276cf02e8',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e8212bdbbde1fedac81fc96',
  'category': 'tészta',
  'name': 'rizsszem tészta',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '04bacc74-d8d2-0a41-69ae-41addc003581',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e8212f1bbde1fedac8203c0',
  'category': 'tészta',
  'name': 'tarhonya',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '1e641982-03e9-ff8b-52dd-04be554248e0',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821306bbde1fedac820652',
  'category': 'tészta',
  'name': 'szarvacska tészta',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '1af5305d-bd3f-b910-df2a-ad42454b8eb6',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821336bbde1fedac820d04',
  'category': 'tészta',
  'name': 'lasagne tészta',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '49e56262-545a-cac3-053a-0b82f6a01bbc',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821a7dbbde1fedac830e39',
  'category': 'base',
  'name': 'kókuszreszelék',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '1a73493b-6c9e-c99e-6f90-aa8d6818f6e0',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821c7dbbde1fedac835620',
  'category': 'base',
  'name': 'angol karácsonyi puding',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': 'fde3c9a0-60ae-60ab-027b-04cc1b4b42ed',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821cc1bbde1fedac836015',
  'category': 'base',
  'name': 'áfonyaszósz',
  'volumeEnabled': false,
  'countEnabled': true,
  'massEnabled': false,
  'guid': '8d81e1e0-b0b6-429b-b98c-01892d139809',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821d51bbde1fedac8372cb',
  'category': 'paleo',
  'name': 'kókuszliszt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '6f6cdb93-7c68-bb13-9a57-218a6e9e6142',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821d62bbde1fedac837556',
  'category': 'paleo',
  'name': 'mákliszt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '0847f664-ff54-f4e8-3c4b-6b98df632af8',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821d79bbde1fedac8378af',
  'category': 'paleo',
  'name': 'gesztenyeliszt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ee270400-82dc-678d-89b5-f39337bdb210',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821db8bbde1fedac8380f9',
  'category': 'paleo',
  'name': 'mákliszt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'bd040e38-4cc7-d392-7ac2-672f80cca45d',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821e6abbde1fedac839b00',
  'category': 'paleo',
  'name': 'lenmagliszt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '6da73d38-1e29-b438-0e6f-47241f15e4d7',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821e7bbbde1fedac839d4d',
  'category': 'paleo',
  'name': 'szezámmagliszt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '1c76552d-6061-749a-9850-228ec4b75565',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821e88bbde1fedac839f0d',
  'category': 'paleo',
  'name': 'tökmagliszt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'd673cff2-c241-2e3a-b39d-cf3616a52e14',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821f1dbbde1fedac83b3fa',
  'category': 'paleo',
  'name': 'paleo kenyérliszt keverék élesztős',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '90606a6b-2e8b-adde-7ee8-9563dc70620e',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821f35bbde1fedac83b739',
  'category': 'paleo',
  'name': 'hajdinás kenyérliszt keverék',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a9082c8a-75b2-9b68-1ec1-5b19ef88b15a',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e821febbbde1fedac83d03a',
  'category': 'paleo',
  'name': 'paleo kókuszkrém',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '4278703e-d87c-6a5c-229b-d637dbd843fb',
  'options': {'cunits': [{'id': '943d430d-cb9c-fa68-5bb7-572367f65497', 'name': 'adag', 'tobase': 40, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e822030bbde1fedac83d9f6',
  'category': 'paleo',
  'name': 'paleo pudingpor',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '65159377-8d02-229a-890b-fe09072965a4',
  'options': {'cunits': [{'id': '3c51b2fe-0449-6809-c9a3-165475b020b3', 'name': 'adag', 'tobase': 35, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e822049bbde1fedac83dd25',
  'category': 'paleo',
  'name': 'paleo tejbegrízpor',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '29fb703f-780a-e89b-7323-30e40520763a',
  'options': {'cunits': [{'id': '5b3d38ee-1725-dd4c-9861-7911efbab4a7', 'name': 'adag', 'tobase': 35, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e822157bbde1fedac84034a',
  'category': 'paleo',
  'name': 'paleo nyújtható lisztkeverék',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '3dd85375-6045-5240-0147-aa454cffc1a5',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e8221b8bbde1fedac84108c',
  'category': 'base',
  'name': 'pisztáciakrém',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'e1a6ea19-83e4-cdc7-93c7-1d15b5f07c87',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e8221d2bbde1fedac84141e',
  'category': 'base',
  'name': 'zakuszka',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'bcd6793e-cb9f-70b6-1cb9-8260d703fe7e',
  'options': {'cunits': [{'id': '9a681442-387a-9b80-cbdc-aa08ce1767cf', 'name': 'üveg', 'tobase': 200, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e822267bbde1fedac8428cc',
  'category': 'base',
  'name': 'heringfilé',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '1131244f-a5c9-b46f-008a-0d07c7492dd9',
  'options': {'cunits': [{'id': '92836088-5fde-f8a7-802f-19d4614c7da9', 'name': 'doboz', 'tobase': 200, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e8222b4bbde1fedac843356',
  'category': 'base',
  'name': 'heringfilé paprikás',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '8393027a-4503-bcd5-04f6-1a72f25cc188',
  'options': {'cunits': [{'id': '18d992b6-dfcf-461b-ced4-dbbbbb9be37a', 'name': 'doboz', 'tobase': 170, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e8222cfbbde1fedac8439b3',
  'category': 'base',
  'name': 'heringfilé mangós-borsos',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '3f06e93a-f103-9a9c-5881-0203f28db044',
  'options': {'cunits': [{'id': '900a7eba-12d9-bc8c-341d-934209d6f8cc', 'name': 'doboz', 'tobase': 200, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e822319bbde1fedac844396',
  'category': 'base',
  'name': 'melegszendvicskrém mexikói',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '65298811-be8a-920c-84e4-9488807e8f39',
  'options': {'cunits': [{'id': 'ae53d983-4463-fec0-52e8-536b906acadb', 'name': 'doboz', 'tobase': 290, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e82241bbbde1fedac84661c',
  'category': 'zöldség',
  'name': 'aprított paradicsom konzerv',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'a911aada-7713-e8b1-ad58-2fc1af0157b6',
  'options': {'cunits': [{'id': '699c0728-6e47-3f4e-1b82-f577da491988', 'name': 'doboz', 'tobase': 240, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e82245dbbde1fedac846eaa',
  'category': 'zöldség',
  'name': 'csicseriborsó konzerv',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '0f7a73a4-83d1-b04d-0852-55ffd2a179e0',
  'options': {'cunits': [{'id': 'b869d5aa-ab80-0a02-823d-f4f51968dfcb', 'name': 'doboz', 'tobase': 530, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e8224acbbde1fedac847933',
  'category': 'base',
  'name': 'tökmag',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'bd25c6ef-f096-ced4-ae1b-1a7819de2244',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e8224b8bbde1fedac847ab3',
  'category': 'base',
  'name': 'lenmag',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'bdd53b70-d118-2464-ba2b-c955e1f4a763',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e8224c6bbde1fedac847cb1',
  'category': 'base',
  'name': 'szezámmag',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'b322be46-ac4a-3407-f2cd-11a9cb9cd650',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e82255fbbde1fedac8490ac',
  'category': 'zöldség',
  'name': 'zöldborsó konzerv',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '7def8424-ca8b-0395-aaae-7d84b5ca7bb3',
  'options': {'cunits': [{'id': '82928907-9d6c-c9c9-3731-b84eeeee197c', 'name': 'üveg', 'tobase': 450, 'type': 2}]},
  'arhived': null
}, {
  '_id': '5e834663bbde1fedaca8f527',
  'category': 'hús',
  'name': 'füstölt kolbász',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'df4af5be-69ae-e763-e2d7-02f501f5ebde',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e836810bbde1fedacad9c66',
  'category': 'gabona',
  'name': 'kukorica (pattogtatni)',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'b441aa96-bd2f-d407-0685-2b0a2c1dd4fa',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e836820bbde1fedacad9ed8',
  'category': 'gabona',
  'name': 'kukoricadara',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '88a8ae23-1357-e8b5-d081-c08fdd68b57d',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e836884bbde1fedacadaba7',
  'category': 'gabona',
  'name': 'köles',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '02fe36c2-efb0-9de2-e489-17dd50038794',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e836894bbde1fedacadade1',
  'category': 'gabona',
  'name': 'hajdina',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'c973c023-263e-6e63-0661-9e16397a4a80',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e836988bbde1fedacadce94',
  'category': 'gabona',
  'name': 'zabpehelyliszt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'aac092ef-a075-0b51-c74b-2fb33aad02c0',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e836af2bbde1fedacae002f',
  'category': 'gabona',
  'name': 'quinoa',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '52e2f129-8d47-cbb4-01b2-205eeadd21ff',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e836b02bbde1fedacae021e',
  'category': 'gabona',
  'name': 'gersli',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '277046bb-41f5-c3fe-def8-861e05c05beb',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e836b86bbde1fedacae123e',
  'category': 'mag',
  'name': 'darált dió',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '243caa27-1a5f-c143-c932-97b6d8e004aa',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e836c13bbde1fedacae250e',
  'category': 'konzerv',
  'name': 'olivabogyó',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '2c4227de-3fc6-6695-5ab6-41e2d063cd2d',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e8c9e3aa6e1684da0449181',
  'category': 'fűszer',
  'name': 'citromhéj',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '5a1315ac-f882-f264-f6d1-1f8fe6fdc76e',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e8cb0aa19c1864f9012baae',
  'category': 'zöldség',
  'name': 'bab',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': '9ab2b8a3-21d0-65e1-cf91-2693c9383a60',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e8cb22419c1864f9012bd06',
  'category': 'tejtermék',
  'name': 'juhtúró',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'fc4958f1-7c10-4146-831c-b7e8528b9449',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e8cbf85197b2451004d2537',
  'category': 'base',
  'name': 'kenyérkocka',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'f3921427-496f-6123-46ad-1c987cca47f3',
  'options': {'cunits': []},
  'arhived': null
}, {
  '_id': '5e8cc067197b2451004d2621',
  'category': 'base',
  'name': 'rozsliszt',
  'volumeEnabled': false,
  'countEnabled': false,
  'massEnabled': true,
  'guid': 'ee1ca692-8a78-15a9-b070-b51616a1bcd9',
  'options': {'cunits': []},
  'arhived': null
}];
