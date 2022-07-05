import React, { useState, useRef, useEffect } from 'react'
import TextStyle from '@/components/atoms/textstyle'
import { Box, Grid, IconButton, Modal } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import CartTile from '@/components/molecules/carttile'
import TopicTag from '@/components/molecules/topictag'
import MiniCartTile from '@/components/molecules/minicarttile'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { components } from '@/const/components'
import Link from '@/components/atoms/link'
import { useRouter } from 'next/router'
import imageoptimization from '@/const/imageoptimization'

const useStyles = makeStyles((theme) => ({
  tocLink: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    '&:hover, &:focus': {
      color: theme.palette.hover.main,
    },
  },
  chapter: {
    marginBottom: theme.spacing(1),
  },
  modal: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey.dark,
    height: '100vh',
    width: '100vw',
    position: 'absolute',
    padding: theme.spacing(2, 0, 0, 0),
    [theme.breakpoints.up('md')]: {
      width: '800px',
      height: '75vh',
      borderRadius: '16px',
      top: '15%',
      left: '50%',
      transform: 'translate(-50%, -10%)',
      boxShadow: theme.shadows[5],
    },
  },
  navButton: {
    width: 44,
    height: 44,
    border: '1px solid #C5CED1',
    boxShadow: theme.shadows[4],
    [theme.breakpoints.up('md')]: {
      backgroundColor: theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.common.white,
      },
    },
  },
  navIcon: {
    '& svg': {
      width: 44,
      height: 44,
    },
  },
  navGridItem: {
    display: 'flex',
    alignItems: 'center',
  },
  body: {
    height: '100vh',
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      height: '68vh',
      overflowX: 'scroll',
    },
    paddingBottom: 32,
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  bodyText: {
    overflowX: 'auto',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  closeModalButton: {
    marginRight: theme.spacing(2),
    color: theme.palette.common.white,
  },
  modalBody: {
    overflow: 'hidden',
    height: '95%',
    borderRadius: '0 0 16px 16px',
    backgroundColor: 'white',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
    },
  },
  modalBodyTitle: {
    width: '45vw',
    backgroundColor: 'white',
    paddingTop: '24px',
    paddingBottom: '16px',
    position: 'fixed',
  },
  controls: {
    display: 'flex',
    position: 'absolute',
    width: '103%',
    top: '50%',
    left: '-2.7%',
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('xs')]: {
      width: '94%',
      top: '44%',
      left: '1%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      top: '44%',
      left: '1.5%',
    },
    [theme.breakpoints.up('md')]: {
      width: '109%',
      top: '44%',
      left: '-3.4%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '109%',
      top: '44%',
      left: '-2.5%',
    },
    [theme.breakpoints.up('xl')]: {
      width: '109%',
      top: '44%',
      left: '-1.5%',
    },
  },
}))
const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      return (
        <Box my={6}>
          {components(node.data.target, Math.floor(Math.random() * 10 + 1))}
        </Box>
      )
    },
    [INLINES.EMBEDDED_ENTRY]: (node, children) => {
      return (
        <Box my={6}>
          {components(node.data.target, Math.floor(Math.random() * 10 + 1))}
        </Box>
      )
    },
    [BLOCKS.EMBEDDED_ASSET]: (node) => (
      <img
        src={
          node.data?.target?.fields?.file?.url +
          '?' +
          imageoptimization.qualityParameter +
          '=' +
          imageoptimization.qualityValue
        }
        alt={node.data?.target?.fields?.title}
        style={{ marginTop: '48px', marginBottom: '48px', width: '100%' }}
      />
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <Box my={2}>
        <TextStyle variant='articleBody'>{children}</TextStyle>
      </Box>
    ),
    [BLOCKS.HEADING_2]: (node, children) => {
      return (
        <TextStyle
          component='h2'
          variant='h3'
          style={{ marginBlockStart: '48px', marginBlockEnd: '16px' }}
        >
          {children[0]}
        </TextStyle>
      )
    },
    [INLINES.HYPERLINK]: (node, children) => {
      return (
        <Link
          href={node.data.uri}
          target={
            node.data.uri?.toLowerCase().includes('https://ascd.org')
              ? ''
              : '_blank'
          }
        >
          {children}
        </Link>
      )
    },
  },
}

/**
 * The Chapter Preview displays book chapters based on access levels the user has.
 * Some chapters are free for everyone. The modal is displayed based on the url query parameter
 * and if the user has access to that chapter. The route is added to the browser history, so the user can use
 * the back and forward buttons on the browser and also bookmark the displayed chapter.
 *
 * @return {Component}
 */
const ChapterPreview = ({
  digitalFileGuid,
  hasMemberBookAccess,
  bookTitle,
  slug,
  productNumber,
  thumbnail,
  description,
  price,
  chapters,
  authors,
  custom1Value,
  ...props
}) => {
  const classes = useStyles(props)
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [currentChapter, setCurrentChapter] = useState()
  const [currentChapterIndex, setCurrentChapterIndex] = useState()

  const hasAccessToChapter = (chapter) =>
    (hasMemberBookAccess && chapter) || chapter?.fields.freeChapter
      ? true
      : false

  const setChapterPreview = (chapter) => {
    if (hasAccessToChapter(chapter)) {
      setCurrentChapter(chapter)
      setCurrentChapterIndex(
        chapters.findIndex((item) => item.sys.id === chapter?.sys.id)
      )
      setOpen(true)
    } else {
      setOpen(false)
      setCurrentChapter(undefined)
      setCurrentChapterIndex()
    }
  }

  useEffect(() => {
    if (router.query.chapter) {
      const chapter = chapters.find(
        (chapter) => chapter.fields?.slug === router.query.chapter
      )
      setChapterPreview(chapter)
    } else {
      setChapterPreview()
    }
  }, [router.query])

  const PreviousBtn = () => {
    const prevChapter =
      chapters &&
      chapters
        .filter(
          (item, index) =>
            index < currentChapterIndex && hasAccessToChapter(item)
        )
        .pop()

    return (
      <>
        {prevChapter && (
          <IconButton
            aria-label='go to previous chapter'
            className={classes.navButton}
            onClick={() =>
              router
                .push(
                  {
                    pathname: `/books/${slug}`,
                    query: { chapter: prevChapter.fields.slug },
                  },
                  null,
                  {
                    scroll: false,
                    shallow: true,
                  }
                )
                .then(() => topRef.current.scrollTo(0, 0))
            }
          >
            <img src='/images/left.svg' className={classes.navIcon} />
          </IconButton>
        )}
      </>
    )
  }

  const NextBtn = () => {
    const nextChapter =
      chapters &&
      chapters.find(
        (item, index) => index > currentChapterIndex && hasAccessToChapter(item)
      )

    return (
      <>
        {nextChapter && (
          <IconButton
            aria-label='go to next chapter'
            className={classes.navButton}
            onClick={() =>
              router
                .push(
                  {
                    pathname: `/books/${slug}`,
                    query: { chapter: nextChapter.fields.slug },
                  },
                  null,
                  {
                    scroll: false,
                    shallow: true,
                  }
                )
                .then(() => topRef.current.scrollTo(0, 0))
            }
          >
            <img src='/images/right.svg' className={classes.navIcon} />
          </IconButton>
        )}
      </>
    )
  }

  const imgUrl = thumbnail?.fields?.imageBynder
    ? thumbnail?.fields?.imageBynder[0]?.src +
      '?' +
      imageoptimization.qualityParameter +
      '=' +
      imageoptimization.qualityValue
    : thumbnail?.fields?.imageContentful?.fields?.file?.url
    ? thumbnail?.fields?.imageContentful?.fields?.file?.url +
      '?' +
      imageoptimization.qualityParameter +
      '=' +
      imageoptimization.qualityValue
    : '/images/ASCDImageFiller.png'
  const topRef = useRef(null)
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby={`chapter-modal-${currentChapter?.fields?.title}`}
      aria-describedby={`chapter-modal-description-${currentChapter?.fields?.title}`}
    >
      <div className={classes.modal}>
        <Box display='flex' alignItems='flex-end' mb={2} pl={2} pr={2}>
          <IconButton
            aria-label='Close modal button'
            className={classes.closeModalButton}
          >
            <CloseIcon size='small' onClick={() => setOpen(null)} />
          </IconButton>
          <TextStyle variant='h5'>Chapter Preview</TextStyle>
        </Box>
        <Grid container className={classes.modalBody}>
          <Box className={classes.controls}>
            <Grid item xs={1} className={classes.navGridItem}>
              <PreviousBtn />
            </Grid>
            <Grid item xs={1} className={classes.navGridItem}>
              <NextBtn />
            </Grid>
          </Box>
          <Box
            className={classes.body}
            display='flex'
            flexDirection={['column', 'row']}
          >
            <Box
              className={classes.bodyText}
              id={`chapter-modal-description-${currentChapter?.fields?.slug}`}
              color='black'
              pl={[6.5, 8, 3]}
              pt={3}
              pr={[6, 3, 7]}
              display='flex'
              flexDirection='column'
              minWidth={['80vw', '30vw', '35vw', '27vw']}
              height={['83vh', 'auto']}
              ref={topRef}
            >
              <TopicTag
                variant='special'
                label={currentChapter?.fields.label}
                color='black'
              />
              <TextStyle color='black' variant='h3'>
                {currentChapter?.fields.title}
              </TextStyle>
              {documentToReactComponents(currentChapter?.fields.body, options)}
            </Box>
            <Box
              pt={3}
              pr={3}
              position='sticky'
              maxHeight='488px'
              top='0'
              display={['none', 'initial']}
            >
              <CartTile
                snipcart={{
                  label: 'Add to Cart',
                  dataItemId: productNumber,
                  dataItemName: bookTitle,
                  dataItemUrl: slug,
                  dataItemImage: imgUrl,
                  dataItemDescription: description,
                  dataItemPrice: price,
                  dataItemCustom1Value: custom1Value,
                  dataItemAuthors: authors,
                  digitalFileGuid: digitalFileGuid,
                }}
                // onclick={() => setOpen(null)}
                noHover
              />
            </Box>
            <Box display={['initial', 'none']} position='fixed' bottom='0'>
              <MiniCartTile
                snipcart={{
                  label: 'Add to Cart',
                  dataItemId: productNumber,
                  dataItemName: bookTitle,
                  dataItemUrl: slug,
                  dataItemImage: imgUrl,
                  dataItemDescription: description,
                  dataItemPrice: price,
                  dataItemCustom1Value: custom1Value,
                  dataItemAuthors: authors,
                  digitalFileGuid: digitalFileGuid,
                }}
                // onclick={() => setOpen(null)}
              />
            </Box>
          </Box>
        </Grid>
      </div>
    </Modal>
  )
}

export default ChapterPreview
