import { IWuwaCharacterModel, WuwaCharacterModel } from '@/models/wuwaCharacter'
import { MongoDBService } from '@/services/database'

async function main() {
    await MongoDBService.lazy(process.env.MONGO_URI)
    await WuwaCharacterModel.getCollection().deleteMany({})

    const now = new Date()

    const characters: Omit<IWuwaCharacterModel, 'createdAt' | 'updatedAt'>[] = [
        {
            name: 'zhezhi',
            element: 'ice',
            sex: 'female',
            accentColor: '#93E0FF',
            photoUrl: '/characters/zhezhi.png',
        },
        {
            name: 'lingyang',
            element: 'ice',
            sex: 'female',
            accentColor: '#93E0FF',
            photoUrl: '/characters/lingyang.png',
        },
        {
            name: 'sanhua',
            element: 'ice',
            sex: 'female',
            accentColor: '#93E0FF',
            photoUrl: '/characters/sanhua.png',
        },
        {
            name: 'baizhi',
            element: 'ice',
            sex: 'female',
            accentColor: '#93E0FF',
            photoUrl: '/characters/baizhi.png',
        },

        {
            name: 'jianxin',
            element: 'aero',
            sex: 'female',
            accentColor: '#CBFFC8',
            photoUrl: '/characters/jianxin.png',
        },
        {
            name: 'yangyang',
            element: 'aero',
            sex: 'female',
            accentColor: '#CBFFC8',
            photoUrl: '/characters/yangyang.png',
        },
        {
            name: 'aalto',
            element: 'aero',
            sex: 'male',
            accentColor: '#CBFFC8',
            photoUrl: '/characters/aalto.png',
        },
        {
            name: 'jiyan',
            element: 'aero',
            sex: 'male',
            accentColor: '#CBFFC8',
            photoUrl: '/characters/jiyan.png',
        },

        {
            name: 'calcharo',
            element: 'electro',
            sex: 'male',
            accentColor: '#845BAE',
            photoUrl: '/characters/calcharo.png',
        },
        {
            name: 'xiangli yao',
            element: 'electro',
            sex: 'male',
            accentColor: '#845BAE',
            photoUrl: '/characters/xiangli_yao.png',
        },
        {
            name: 'yuanwu',
            element: 'electro',
            sex: 'male',
            accentColor: '#845BAE',
            photoUrl: '/characters/yuanwu.png',
        },
        {
            name: 'yinlin',
            element: 'electro',
            sex: 'female',
            accentColor: '#845BAE',
            photoUrl: '/characters/yinlin.png',
        },

        {
            name: 'verina',
            element: 'spectro',
            sex: 'female',
            accentColor: '#DED062',
            photoUrl: '/characters/verina.png',
        },
        {
            name: 'jinhsi',
            element: 'spectro',
            sex: 'female',
            accentColor: '#DED062',
            photoUrl: '/characters/jinhsi.png',
        },
        {
            name: 'shorekeeper',
            element: 'spectro',
            sex: 'female',
            accentColor: '#DED062',
            photoUrl: '/characters/shorekeeper.png',
        },
        {
            name: 'rover',
            element: 'spectro',
            sex: 'male',
            accentColor: '#DED062',
            photoUrl: '/characters/rover_male.png',
        },
        {
            name: 'rover',
            element: 'spectro',
            sex: 'female',
            accentColor: '#DED062',
            photoUrl: '/characters/rover_female.png',
        },

        {
            name: 'taoqi',
            element: 'havoc',
            sex: 'female',
            accentColor: '#FF8BCF',
            photoUrl: '/characters/taoqi.png',
        },
        {
            name: 'danjin',
            element: 'havoc',
            sex: 'female',
            accentColor: '#FF8BCF',
            photoUrl: '/characters/danjin.png',
        },
        {
            name: 'rover',
            element: 'havoc',
            sex: 'male',
            accentColor: '#FF8BCF',
            photoUrl: '/characters/rover_male.png',
        },
        {
            name: 'rover',
            element: 'havoc',
            sex: 'female',
            accentColor: '#FF8BCF',
            photoUrl: '/characters/rover_female.png',
        },

        {
            name: 'encore',
            element: 'fusion',
            sex: 'female',
            accentColor: '#C2644C',
            photoUrl: '/characters/encore.png',
        },
        {
            name: 'changli',
            element: 'fusion',
            sex: 'female',
            accentColor: '#C2644C',
            photoUrl: '/characters/changli.png',
        },
        {
            name: 'chixia',
            element: 'fusion',
            sex: 'female',
            accentColor: '#C2644C',
            photoUrl: '/characters/chixia.png',
        },
        {
            name: 'mortefi',
            element: 'fusion',
            sex: 'male',
            accentColor: '#C2644C',
            photoUrl: '/characters/mortefi.png',
        },
    ]

    const mapped = characters.map<IWuwaCharacterModel>((c) => ({
        ...c,
        photoUrl: `https://127.0.0.1:3000${c.photoUrl}`,
        createdAt: now,
        updatedAt: now,
    }))

    await WuwaCharacterModel.getCollection().insertMany(mapped)

    console.log('Done!')
}

main().then(() => process.exit(0))
