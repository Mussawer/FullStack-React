import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Alert, Avatar, Button, List, Spin } from "antd";
import "./styles/Listings.css";
import { ListingsSkeleton } from "./components";
import {
  DeleteListingData,
  DeleteListingVariables,
  ListingsData,
} from "./types";

//graphql Mutation
const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
      title
    }
  }
`;

//graphql Query
const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);

  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    refetch();
  };

  const listings = data ? data.listings : null;

  const deleteListingErrorAlert = deleteListingError ? (
    <Alert
      type="error"
      message="Uh oh! Something went wrong :(. Please try again later."
      className="listings__alert"
    />
  ) : null;

  //without antdesign

  // const deleteListingErrorMessage = deleteListingError ? (
  //   <h4>
  //     Uh oh! Something went wrong with deleting :(. Please try again soon.
  //   </h4>
  // ) : null;

  const listingList = listings ? (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              type="primary"
              onClick={() => handleDeleteListing(listing.id)}
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          />
        </List.Item>
      )}
    />
  ) : null;

  //without antdesign

  // const listingList = listings ? (
  //   <ul>
  //     {listings.map((listing) => {
  //       return (
  //         <li key={listing.id}>
  //           {listing.title}{" "}
  //           <button onClick={() => handleDeleteListings(listing.id)}>
  //             Delete
  //           </button>
  //         </li>
  //       );
  //     })}
  //   </ul>
  // ) : null;

  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error />
      </div>
    );
  }

  return (
    <div className="listings">
      <Spin spinning={deleteListingLoading}>
        {deleteListingErrorAlert}
        <h2>{title}</h2>
        {listingList}
      </Spin>
    </div>
  );
};
