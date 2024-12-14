import { IWuwaCharacterModel, WuwaCharacterModel } from '@/models/wuwaCharacter'
import { MongoDBService } from '@/services/database'

async function main() {
    await MongoDBService.lazy(process.env.MONGO_URI)
    await WuwaCharacterModel.getCollection().deleteMany({})

    const now = new Date()

    const characters: Omit<IWuwaCharacterModel, 'createdAt' | 'updatedAt' | 'photoUrl'>[] = [
        {
            name: 'zhezhi',
            element: 'ice',
            sex: 'female',
            accentColor: '#93E0FF',
            photoPath: '/characters/zhezhi.png',
        },
        {
            name: 'lingyang',
            element: 'ice',
            sex: 'female',
            accentColor: '#93E0FF',
            photoPath: '/characters/lingyang.png',
        },
        {
            name: 'sanhua',
            element: 'ice',
            sex: 'female',
            accentColor: '#93E0FF',
            photoPath: '/characters/sanhua.png',
        },
        {
            name: 'baizhi',
            element: 'ice',
            sex: 'female',
            accentColor: '#93E0FF',
            photoPath: '/characters/baizhi.png',
        },

        {
            name: 'jianxin',
            element: 'aero',
            sex: 'female',
            accentColor: '#CBFFC8',
            photoPath: '/characters/jianxin.png',
        },
        {
            name: 'yangyang',
            element: 'aero',
            sex: 'female',
            accentColor: '#CBFFC8',
            photoPath: '/characters/yangyang.png',
        },
        {
            name: 'aalto',
            element: 'aero',
            sex: 'male',
            accentColor: '#CBFFC8',
            photoPath: '/characters/aalto.png',
        },
        {
            name: 'jiyan',
            element: 'aero',
            sex: 'male',
            accentColor: '#CBFFC8',
            photoPath: '/characters/jiyan.png',
        },

        {
            name: 'calcharo',
            element: 'electro',
            sex: 'male',
            accentColor: '#845BAE',
            photoPath: '/characters/calcharo.png',
        },
        {
            name: 'xiangli yao',
            element: 'electro',
            sex: 'male',
            accentColor: '#845BAE',
            photoPath: '/characters/xiangli_yao.png',
        },
        {
            name: 'yuanwu',
            element: 'electro',
            sex: 'male',
            accentColor: '#845BAE',
            photoPath: '/characters/yuanwu.png',
        },
        {
            name: 'yinlin',
            element: 'electro',
            sex: 'female',
            accentColor: '#845BAE',
            photoPath: '/characters/yinlin.png',
        },

        {
            name: 'verina',
            element: 'spectro',
            sex: 'female',
            accentColor: '#DED062',
            photoPath: '/characters/verina.png',
        },
        {
            name: 'jinhsi',
            element: 'spectro',
            sex: 'female',
            accentColor: '#DED062',
            photoPath: '/characters/jinhsi.png',
        },
        {
            name: 'shorekeeper',
            element: 'spectro',
            sex: 'female',
            accentColor: '#DED062',
            photoPath: '/characters/shorekeeper.png',
        },
        {
            name: 'rover',
            element: 'spectro',
            sex: 'male',
            accentColor: '#DED062',
            photoPath: '/characters/rover_male.png',
        },
        {
            name: 'rover',
            element: 'spectro',
            sex: 'female',
            accentColor: '#DED062',
            photoPath: '/characters/rover_female.png',
        },

        {
            name: 'taoqi',
            element: 'havoc',
            sex: 'female',
            accentColor: '#FF8BCF',
            photoPath: '/characters/taoqi.png',
        },
        {
            name: 'danjin',
            element: 'havoc',
            sex: 'female',
            accentColor: '#FF8BCF',
            photoPath: '/characters/danjin.png',
        },
        {
            name: 'rover',
            element: 'havoc',
            sex: 'male',
            accentColor: '#FF8BCF',
            photoPath: '/characters/rover_male.png',
        },
        {
            name: 'rover',
            element: 'havoc',
            sex: 'female',
            accentColor: '#FF8BCF',
            photoPath: '/characters/rover_female.png',
        },

        {
            name: 'encore',
            element: 'fusion',
            sex: 'female',
            accentColor: '#C2644C',
            photoPath: '/characters/encore.png',
        },
        {
            name: 'changli',
            element: 'fusion',
            sex: 'female',
            accentColor: '#C2644C',
            photoPath: '/characters/changli.png',
        },
        {
            name: 'chixia',
            element: 'fusion',
            sex: 'female',
            accentColor: '#C2644C',
            photoPath: '/characters/chixia.png',
        },
        {
            name: 'mortefi',
            element: 'fusion',
            sex: 'male',
            accentColor: '#C2644C',
            photoPath: '/characters/mortefi.png',
        },
    ]

    const mapped = characters.map<IWuwaCharacterModel>((c) => ({
        ...c,
        photoUrl: `https://127.0.0.1:3000${c.photoPath}`,
        createdAt: now,
        updatedAt: now,
    }))

    await WuwaCharacterModel.getCollection().insertMany(mapped)

    console.log('Done!')
}

main().then(() => process.exit(0))
