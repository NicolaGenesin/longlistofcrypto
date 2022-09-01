import React, { Fragment, useEffect, useState, useMemo } from 'react'
import { Link, Box, useMediaQuery, Tbody, Td, Th, Thead, Tr, Text, Select, HStack, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { InView } from 'react-intersection-observer';
import { url } from '../env'
// import { FixedSizeList as List } from 'react-window';
// import AutoSizer from "react-virtualized-auto-sizer";
import { Table } from "react-fluid-table";



const headers = ["#", "Project Name", "Category", "Sub-category", "Chain", "1-liner Description"]

const rowStyle = (index: number) => ({
  backgroundColor: index % 2 === 0 ? "#FEEBC8" : "#FFFAF0"
});

const columns = [
  {
    key: "index",
    header: "#",
    width: 50,
    maxWidth: 50
  },
  {
    key: "projectName",
    header: "Project Name",
    content: ({ row }) => <Box p={2} key="td-projectname" whiteSpace="nowrap" fontSize="xs" >🔗 <Link href={row.website}><b>{row.projectName}</b></Link></Box>,
    width: 200,
    maxWidth: 200
  },
  {
    key: "category",
    header: "Category",
    content: ({ row }) => <Box p={2} key="td-projectname" whiteSpace="nowrap" fontSize="xs">{row.category}</Box>,
    width: 200,
    maxWidth: 200
  },
  {
    key: "subcategory",
    header: "Subcategory",
    content: ({ row }) => <Box p={2} key="td-projectname" whiteSpace="nowrap" fontSize="xs">{row.subcategory}</Box>,
    width: 200,
    maxWidth: 200
  },
  {
    key: "chain",
    header: "Chain",
    content: ({ row }) => <Box p={2} key="td-projectname" whiteSpace="nowrap" fontSize="xs">
      {row.chain ? row.chain.split(', ').map((s: string, index: number) => (
        <Fragment key={`fr-${index}`}>
          {s}
          <br />
        </Fragment>
      )) : "-"}
    </Box>,
    width: 150,
    maxWidth: 150
  },
  {
    key: "description",
    header: "1-liner Description",
    content: ({ row }) => <Box p={2} key="td-projectname" fontSize="xs">{row.description}</Box>,
  },
];

const Home: NextPage = ({ results = [], lastAdded, lastUpdated }: any) => {
  const selectsData: any = useMemo(() => {
    const tmp: any = {}

    results.forEach((r: string[]) => {
      const category = r[2]

      if (!tmp[category]) {
        tmp[category] = [r[3]]
      } else {
        if (!tmp[category].find((s: string) => s === r[3])) {
          tmp[category].push(r[3])
        }
      }
    })

    return tmp
  }, [results])

  const [selectedWord, setSelectedWord] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>();
  const rows = useMemo(() => {
    let tmp = [...results]

    if (selectedCategory) {
      tmp = tmp.filter((row) => row[2] === selectedCategory)
    }

    if (selectedSubCategory) {
      tmp = tmp.filter((row) => row[3] === selectedSubCategory)
    }

    if (selectedWord) {
      tmp = tmp.filter((row) => row[4].includes(selectedWord) || row[5].includes(selectedWord))
    }

    tmp = tmp.map(t => {
      return {
        index: t[0],
        projectName: t[1],
        category: t[2],
        subcategory: t[3],
        chain: t[4],
        description: t[5],
        website: t[6],
      }
    })

    return tmp
  }, [results, selectedCategory, selectedSubCategory, selectedWord])

  useEffect(() => {
    setSelectedSubCategory(undefined)
  }, [selectedCategory]);

  const [isSmallViewport] = useMediaQuery('(min-width: 960px)')

  console.log(rows)

  return (
    <Box className={styles.container} bg="#fffef2">
      <Head>
        <title>Long list of Crypto</title>
        <meta name="description" content="A long list of blockchain/crypto/Web3 projects with respective 1-liner description." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Box backgroundImage={"/header.jpg"} p={8} mb={4} rounded="xl" textAlign="center" >
          <Text as="h1" fontSize="4xl" mb={4}>
            <b>Long list of Crypto</b>
          </Text>

          <Text fontSize="xl" mt={4} mb={4}>
            🚧 <b>{results.length}</b> so far - {lastUpdated} - {lastAdded} 🚧
          </Text>

          <Box mt="16px" mb="8px" >
            <Text>A long list of blockchain/crypto/Web3 projects with respective 1-liner description.</Text>
            <Text>Managed by Michael, reach out on Twitter: <a style={{ color: 'teal' }} href={"https://twitter.com/brazenburrit0"}>brazenburrit0</a> or Telegram: @brazenburrito</Text>
            <Text fontSize="xs" mt={4} fontStyle="italic">If you come across a new project or a project that has yet to be included in the list,<br />please fill up this form and I will add to the list: <Link style={{ textDecoration: "underline" }} href="https://forms.gle/BssASs7NWRWdmQ4S9">Contribution Form Link</Link></Text>
            <Text fontSize="xs" fontStyle="italic">Entirely optional but can support @ brazenburrito.eth | 0xb3e1EF38c290016dbfc3D13d1C91c32B6ec0C0C7</Text>
          </Box>
        </Box>

        <HStack mb={8} mt={4} bg="#f1e5dc" p={4} rounded="md">
          <Select placeholder='Select Category' bg="white" size="sm" onChange={e => { setSelectedCategory(e.target.value) }} value={selectedCategory}>
            {Object.keys(selectsData).map(c => <option key={c} value={c}>{c}</option>)}
          </Select>

          {selectedCategory && <Select placeholder='Select Sub Category' bg="white" size="sm" onChange={e => { setSelectedSubCategory(e.target.value) }} value={selectedSubCategory}>
            {selectsData[selectedCategory].map((c: string) => <option key={c} value={c}>{c}</option>)}
          </Select>}

          <InputGroup size='sm' bg="white">
            <InputLeftAddon children='Filter by text' />
            <Input defaultValue={selectedWord} onChange={(e) => {
              setSelectedWord(e.target.value)
            }} />
          </InputGroup>
        </HStack>
        <Table
          data={rows}
          columns={columns}
          tableStyle={{}}
          headerStyle={{}}
          rowStyle={rowStyle}
        />
      </main >
    </Box >
  )
}

const getData = async () => {
  const results = fetch(`${url}/api/data`, {
    method: "GET",
  });

  return results;
};

export async function getStaticProps() {
  const { results, lastAdded, lastUpdated } = await (await getData()).json();

  return {
    props: { results, lastAdded, lastUpdated },
    revalidate: 900,
  };
}

export default Home
