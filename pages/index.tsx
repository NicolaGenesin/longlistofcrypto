import React, { Fragment, useEffect, useState, useMemo } from 'react'
import { Link, Box, Table, useMediaQuery, Tbody, Td, Th, Thead, Tr, Text, Select, HStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { url } from '../env'

const headers = ["#", "Project Name", "Category", "Sub-category", "Chain", "1-liner Description", "Date Added"]

const Home: NextPage = ({ results = [], lastAdded, lastUpdated }: any) => {
  const selectsData: any = useMemo(() => {
    const tmp: any = {}

    results.forEach((r: string[]) => {
      const category = r[2]

      // Hack: some emoji look the same, but they have a different code
      const categoryWithoutEmoji = category.slice(3)
      const existingCategories = Object.keys(tmp)
      const existingCategory = existingCategories.find(x => x.includes(categoryWithoutEmoji))

      if (!tmp[category] && !existingCategory) {
        tmp[category] = [r[3]]
      } else {
        if (!tmp[existingCategory || category].find((s: string) => s === r[3])) {
          tmp[existingCategory || category].push(r[3])
        }
      }
      // End Hack

    })

    return tmp
  }, [results])

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

    return tmp
  }, [results, selectedCategory, selectedSubCategory])

  useEffect(() => {
    setSelectedSubCategory(undefined)
  }, [selectedCategory]);

  const [isSmallViewport] = useMediaQuery('(min-width: 960px)')

  return (
    <Box className={styles.container} bg="#fffef2">
      <Head>
        <title>Long list of Crypto</title>
        <meta name="description" content="A long list of blockchain/crypto/Web3 projects with respective 1-liner description." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box backgroundImage={"/header.jpg"} p={8} mb={4} rounded="xl" textAlign="center">
          <Text as="h1" fontSize="4xl" mb={4}>
            <b>Long list of Crypto</b>
          </Text>

          {
            results &&
            <Text fontSize="xl" mt={4} mb={4}>
              🚧 <b>{results.length} so far - {lastUpdated} - {lastAdded}</b> 🚧
            </Text>
          }

          <Box mt="16px" mb="8px" >
            <Text>A long list of blockchain/crypto/Web3 projects with respective 1-liner description.</Text>
            <Text>Managed by Michael, reach out on Twitter: <a style={{ color: 'teal' }} href={"https://twitter.com/brazenburrit0"}>brazenburrit0</a> or Telegram: @brazenburrito</Text>
            <Text fontSize="xs" mt={2} fontStyle="italic">If you come across a new project or a project that has yet to be included in the list, please fill up this form and I will add to the list: <Link style={{ textDecoration: "underline" }} href="https://forms.gle/BssASs7NWRWdmQ4S9">Contribution Form Link</Link></Text>
            <Text fontSize="xs" fontStyle="italic">Entirely optional but can support @ brazenburrito.eth | 0xb3e1EF38c290016dbfc3D13d1C91c32B6ec0C0C7</Text>
          </Box>
        </Box>

        <HStack mb={8} mt={4}>
          <Select placeholder='Select Category' bg="white" size="sm" onChange={e => { setSelectedCategory(e.target.value) }} value={selectedCategory}>
            {Object.keys(selectsData).map(c => <option key={c} value={c}>{c}</option>)}
          </Select>

          {selectedCategory && <Select placeholder='Select Sub Category' bg="white" size="sm" onChange={e => { setSelectedSubCategory(e.target.value) }} value={selectedSubCategory}>
            {selectsData[selectedCategory].map((c: string) => <option key={c} value={c}>{c}</option>)}
          </Select>}
        </HStack>

        <Box style={{
          display: "block",
          maxWidth: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: !isSmallViewport ? "nowrap" : "normal"
        }}>
          <Table size='sm' variant='striped' colorScheme='orange'>
            <Thead>
              <Tr>
                {headers.map((header, index) => (<Th key={`header-${index}`}>{header}</Th>))}
              </Tr>
            </Thead>
            <Tbody>
              {rows
                .map((row: string[], index: number) => (
                  <Tr key={`crypto-${index}`}>
                    <Td p={2} key="td-index">{row[0]}</Td>
                    <Td p={2} key="td-projectname" style={{ whiteSpace: "nowrap" }}>🔗 <Link href={row[6]}><b>{row[1]}</b></Link></Td>
                    <Td p={2} key="td-category" fontSize="xs" style={{ whiteSpace: "nowrap" }}>{row[2]}</Td>
                    <Td p={2} key="td-subcategory" fontSize="xs">{row[3]}</Td>
                    <Td p={2} key="td-chain" fontSize="xs">
                      {row[4] ? row[4].split(', ').map((s: string, index: number) => (
                        <Fragment key={`fr-${index}`}>
                          {s}
                          <br />
                        </Fragment>
                      )) : "-"}
                    </Td>
                    <Td p={2} key="td-description" fontSize="xs">{row[5]}</Td>
                    <Td p={2} key="td-addedon" fontSize="xs">{row[7]}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
      </main >
      <footer className={styles.footer}>
        <b>Contributed by Community; Owned by Community; For the Community</b>
      </footer>
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
