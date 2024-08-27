import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@mui/material/Pagination';
import { Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ReviewCard from './ReviewCard';
import useApiServices from '../api';

const ITEMS_PER_PAGE = 3;

export default function UserReviews() {
  const { getUserMovieLogsPaginated } = useApiServices();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    isPending,
    error,
    data: reviews,
  } = useQuery({
    queryKey: ['userMovieLogs', currentPage], // Included currentPage in the key in order to maintain cached reviews and fetch for new ones
    queryFn: () => getUserMovieLogsPaginated(currentPage - 1, ITEMS_PER_PAGE),
    keepPreviousData: true, // Cache pages of reviews that were already fetched
  });

  return (
    <div style={{ marginBottom: '32px' }}>
      {error ? (
        <p>Error loading user reviews...</p> // Show error message
      ) : isPending ? (
        <CircularProgress /> // Show pending component
      ) : reviews?.movieLogs?.length ? (
        <Stack spacing={2} alignItems="center">
          <Carousel
            swipeable={false}
            draggable={false}
            ssr={true} // To render carousel on server-side
            autoPlay={false}
            keyBoardControl={true}
            removeArrowOnDeviceType={['tablet', 'mobile']}
            deviceType="desktop"
            additionalTransfrom={0}
            arrows={false}
            centerMode={false}
            focusOnSelect={false}
            infinite={false}
            renderButtonGroupOutside
            responsive={{
              desktop: {
                breakpoint: { max: 750, min: 250 },
                items: ITEMS_PER_PAGE,
              },
            }}
          >
            {reviews?.movieLogs?.map((review, index) => (
              <div key={index} style={{ padding: '0 16px' }}>
                <ReviewCard review={review} />
              </div>
            ))}
          </Carousel>

          <Pagination
            count={reviews.totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'white',
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                backgroundColor: '#B164FF',
              },
              '& .MuiPaginationItem-root:hover': {
                backgroundColor: '#6229EE',
              },
            }}
          />
        </Stack>
      ) : (
        <p>{`User doesn't have reviews`}</p>
      )}
    </div>
  );
}
